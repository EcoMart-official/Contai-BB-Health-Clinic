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
import { doctors } from "./clinic";

const router: IRouter = Router();

type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: string;
  reason: string;
};

const appointments: Appointment[] = [
  {
    id: "apt-1001",
    patientId: "patient-demo",
    patientName: "Ananya Das",
    phone: "+91 98765 43210",
    doctorId: "kamal-poddar",
    doctorName: "Dr. Kamal Poddar",
    department: "General Medicine",
    date: "2026-09-12",
    time: "10:30 AM",
    status: "confirmed",
    reason: "Routine follow-up",
  },
  {
    id: "apt-1002",
    patientId: "patient-demo",
    patientName: "Ananya Das",
    phone: "+91 98765 43210",
    doctorId: "suman-sarangi",
    doctorName: "Dr. Suman Sarangi",
    department: "Neuropsychiatry",
    date: "2026-09-20",
    time: "09:00 AM",
    status: "pending",
    reason: "Consultation",
  },
];

const challenges = new Map<string, { phone: string; createdAt: number; code: string }>();

router.post("/booking/otp/request", (req, res): void => {
  const parsed = RequestOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const challengeId = `challenge-${Date.now()}`;
  // Development fallback while SMS delivery is not connected. In production this
  // is the only branch to replace with the provider's send-verification call.
  challenges.set(challengeId, { phone: parsed.data.phone, createdAt: Date.now(), code: "2468" });
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
  res.json(GetAppointmentsResponse.parse(appointments.filter((item) => item.patientId === parsed.data.patientId)));
});

router.post("/booking/appointments", (req, res): void => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const appointment = { id: `apt-${Date.now()}`, ...parsed.data, status: "pending" };
  appointments.unshift(appointment);
  res.status(201).json(CreateAppointmentResponse.parse(appointment));
});

router.patch("/booking/appointments/:id", (req, res): void => {
  const params = UpdateAppointmentParams.safeParse(req.params);
  const body = UpdateAppointmentBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid appointment update." });
    return;
  }
  const appointment = appointments.find((item) => item.id === params.data.id);
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found." });
    return;
  }
  Object.assign(appointment, body.data);
  res.json(UpdateAppointmentResponse.parse(appointment));
});

export { appointments };
export default router;