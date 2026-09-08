import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clinicRouter from "./clinic";
import bookingRouter from "./booking";
import operationsRouter from "./operations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(clinicRouter);
router.use(bookingRouter);
router.use(operationsRouter);

export default router;
