import { Router } from "express";
import eventController from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const eventRouter = Router();

// CLIENTE
eventRouter.get("/", eventController.listarPublicados);

// ORGANIZADOR
eventRouter.get("/search", authMiddleware, roleMiddleware("ORGANIZADOR"), eventController.buscarNaApiExterna);
eventRouter.get("/meus", authMiddleware, roleMiddleware("ORGANIZADOR"), eventController.listarMeus);
eventRouter.post("/", authMiddleware, roleMiddleware("ORGANIZADOR"), eventController.importar);
eventRouter.patch("/:id/publish", authMiddleware, roleMiddleware("ORGANIZADOR"), eventController.publicar);
eventRouter.get("/:id", eventController.buscarPorId);

export default eventRouter;