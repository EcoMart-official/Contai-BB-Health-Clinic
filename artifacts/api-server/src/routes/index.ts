import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clinicRouter from "./clinic";
import bookingRouter from "./booking";
import operationsRouter from "./operations";
import paymentRouter from "./payment";
import patientRouter from "./patient";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(clinicRouter);
router.use(bookingRouter);
router.use(operationsRouter);
router.use(paymentRouter);
router.use(patientRouter);
router.use(adminRouter);

export default router;
