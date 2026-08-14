import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
import sessionRouter from "./routes/session.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import checkinRouter from "./routes/checkin.routes.js";
import cors from "cors";

function createApp() {
    const app = express();

    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }));

    app.use(cors());
    app.use(json());
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));


    app.get("/", (req, res) => {
        return res.json({ message: "API Ticket Hub rodando 🚀" });
    });

    app.use("/api/auth", authRouter);

    app.use("/api/users", userRouter);
    app.use("/api/events", eventRouter);

    app.use("/api/sessions", sessionRouter);

    app.use("/api/tickets", ticketRouter);

    app.use("/api/checkin", checkinRouter);

    return app;
}

export default createApp;