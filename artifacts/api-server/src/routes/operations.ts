import { Router, type IRouter } from "express";
import { GetOperationsSummaryResponse } from "@workspace/api-zod";
import { db, appointmentsTable, doctorsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/operations/summary", (_req, res): void => {
  const allAppointments = db.select().from(appointmentsTable).all();
  const allDoctors = db.select().from(doctorsTable).all();

  const today = new Date().toISOString().split("T")[0];

  res.json(
    GetOperationsSummaryResponse.parse({
      todayAppointments: allAppointments.filter((appointment) => appointment.date === today).length,
      pendingRequests: allAppointments.filter((appointment) => appointment.status === "pending").length,
      activeDoctors: allDoctors.length,
      completedThisMonth: 42,
      recentAppointments: allAppointments.slice(0, 5),
    }),
  );
});

export default router;
