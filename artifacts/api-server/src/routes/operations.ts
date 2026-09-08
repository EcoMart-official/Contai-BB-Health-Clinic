import { Router, type IRouter } from "express";
import { GetOperationsSummaryResponse } from "@workspace/api-zod";
import { appointments } from "./booking";
import { doctors } from "./clinic";

const router: IRouter = Router();

router.get("/operations/summary", (_req, res): void => {
  const confirmed = appointments.filter((appointment) => appointment.status === "confirmed");
  res.json(
    GetOperationsSummaryResponse.parse({
      todayAppointments: appointments.filter((appointment) => appointment.date === "2026-09-08").length,
      pendingRequests: appointments.filter((appointment) => appointment.status === "pending").length,
      activeDoctors: doctors.length,
      completedThisMonth: 42,
      recentAppointments: appointments.slice(0, 5),
    }),
  );
});

export default router;