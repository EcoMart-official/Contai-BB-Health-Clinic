import { Router, type IRouter } from "express";
import {
  RequestOtpBody,
  RequestOtpResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
  GetAppointmentsQueryParams,
  GetAppointmentsResponse,
  CreateAppointmentBody,
  CreateAppointmentResponse,
  UpdateAppointmentParams,
  UpdateAppointmentBody,
  UpdateAppointmentResponse,
} from "@workspace/api-zod";
import { db, appointmentsTable, eq } from "@workspace/db";

const router: IRouter = Router();

const challenges = new Map<string, { phone: string; createdAt: number; code: string }>();

router.post("/booking/otp/request", (req, res): void => {
  const parsed = RequestOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const challengeId = `challenge-${Date.now()}`;
  challenges.set(challengeId, { phone: parsed.data.phone, createdAt: Date.now(), code: "123456" });
  res.json(
    RequestOtpResponse.parse({
      challengeId,
      maskedPhone: `${parsed.data.phone.slice(0, 3)}••••${parsed.data.phone.slice(-2)}`,
      expiresInSeconds: 300,
    }),
  );
});

router.post("/booking/otp/verify", (req, res): void => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const challenge = challenges.get(parsed.data.challengeId);
  if (!challenge || challenge.phone !== parsed.data.phone || Date.now() - challenge.createdAt > 300000 || parsed.data.code !== challenge.code) {
    res.status(401).json({ error: "That code is invalid or has expired." });
    return;
  }
  challenges.delete(parsed.data.challengeId);
  res.json(VerifyOtpResponse.parse({ patientId: `patient-${parsed.data.phone.replace(/\D/g, "").slice(-8)}`, phone: parsed.data.phone, isNew: true }));
});

router.get("/booking/appointments", (req, res): void => {
  const parsed = GetAppointmentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const rows = db.select().from(appointmentsTable).where(eq(appointmentsTable.patientId, parsed.data.patientId)).all();
  res.json(GetAppointmentsResponse.parse(rows));
});

router.post("/booking/appointments", (req, res): void => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const id = `apt-${Date.now()}`;
  const newApt = {
    id,
    patientId: parsed.data.patientId,
    patientName: parsed.data.patientName,
    phone: parsed.data.phone,
    doctorId: parsed.data.doctorId,
    doctorName: parsed.data.doctorName,
    department: parsed.data.department,
    date: parsed.data.date,
    time: parsed.data.time,
    status: "pending",
    reason: parsed.data.reason,
  };

  db.insert(appointmentsTable).values(newApt).run();
  res.status(201).json(CreateAppointmentResponse.parse(newApt));
});

router.patch("/booking/appointments/:id", (req, res): void => {
  const params = UpdateAppointmentParams.safeParse(req.params);
  const body = UpdateAppointmentBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid appointment update." });
    return;
  }

  const existing = db.select().from(appointmentsTable).where(eq(appointmentsTable.id, params.data.id)).get();
  if (!existing) {
    res.status(404).json({ error: "Appointment not found." });
    return;
  }

  const updateData: Partial<typeof existing> = {};
  if (body.data.status) updateData.status = body.data.status;
  if (body.data.date) updateData.date = body.data.date;
  if (body.data.time) updateData.time = body.data.time;

  db.update(appointmentsTable).set(updateData).where(eq(appointmentsTable.id, params.data.id)).run();
  const updated = db.select().from(appointmentsTable).where(eq(appointmentsTable.id, params.data.id)).get();

  res.json(UpdateAppointmentResponse.parse(updated));
});

export default router;
