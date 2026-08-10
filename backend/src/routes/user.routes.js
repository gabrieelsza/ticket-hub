import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/me", authMiddleware, (req, res) => {
  return res.json({
    user: req.user,
  });
});

export default userRouter;