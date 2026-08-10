import { Router } from "express";
import sessionController from "../controllers/session.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const sessionRouter = Router();

// CLIENTE
sessionRouter.get("/evento/:eventId", sessionController.listarPorEvento);
sessionRouter.get("/:id", sessionController.buscarPorId);
sessionRouter.get("/:id/seatmap", sessionController.buscarSeatMap);

// ORGANIZADOR
sessionRouter.post(
  "/evento/:eventId",
  authMiddleware,
  roleMiddleware("ORGANIZADOR"),
  sessionController.criar
);

export default sessionRouter;