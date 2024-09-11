import express from "express";
import { getMe } from "../controller/users/userController.js";
import { protect } from "../controller/guard/protect.js";
import { updatePassword } from "../controller/auth/auth.js";

export const userRouter = express.Router();

userRouter.get("/me", protect, getMe);
userRouter.patch("/update-password", protect, updatePassword);
