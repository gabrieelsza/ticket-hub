import { Router } from "express";
import ticketController from "../controllers/ticket.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const ticketRouter = Router();

ticketRouter.post("/", authMiddleware, roleMiddleware("CLIENTE"), ticketController.comprar);
ticketRouter.get("/me", authMiddleware, roleMiddleware("CLIENTE"), ticketController.meusIngressos);

export default ticketRouter;