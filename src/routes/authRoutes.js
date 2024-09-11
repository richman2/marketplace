import express from "express";
import { forgetPassword, login, logout, resetPasswordToken, signUp } from "../controller/auth/auth.js";
import { protect } from "../controller/guard/protect.js";
export const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/forgetpassword", forgetPassword);
authRouter.post("/resetpassword/:token", resetPasswordToken);
authRouter.post("/logout", protect, logout);
