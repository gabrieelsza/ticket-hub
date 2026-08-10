import express, { json } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

function createApp() {
    const app = express();

    app.use(cors());
    app.use(json());
    app.use(express.json())


    app.get("/", (req, res) => {
        return res.json({ message: "API Ticket Hub rodando 🚀" });
    });

    app.use("/auth", authRouter);
    app.use("/users", userRouter);

    return app;
}


export default createApp;
