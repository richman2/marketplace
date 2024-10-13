import express from "express";
import { getMe } from "../controller/users/userController.js";
import { protect } from "../controller/guard/protect.js";
import { updatePassword } from "../controller/auth/auth.js";
import { address, getAddress } from "../controller/users/addressController.js";

export const userRouter = express.Router();

userRouter.use(protect);
userRouter.get("/me", getMe);
userRouter.patch("/update-password", updatePassword);
userRouter.post("/setAddress", address);
userRouter.get("/getUserAddress", getAddress);
