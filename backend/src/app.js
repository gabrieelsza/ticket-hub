import express, { json } from "express";
import cors from "cors";


function createApp() {
    const app = express();


    app.use(cors());
    app.use(json());


    app.get("/", (req, res) => {
        return res.json({ message: "API Ticket Hub rodando 🚀" });
    });


    return app;
}


export default createApp;
