import { Router } from "express";
import checkinController from "../controllers/checkin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const checkinRouter = Router();

checkinRouter.post("/", authMiddleware, roleMiddleware("PORTARIA"), checkinController.validar);


export default checkinRouter;