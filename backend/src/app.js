import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";

function createApp() {
    const app = express();

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

    return app;
}


export default createApp;
