import express from "express";
import { getMe, updateMe } from "../controller/users/userController.js";
import { protect } from "../controller/guard/protect.js";
import { updatePassword } from "../controller/auth/auth.js";
import { address, getAddress } from "../controller/users/addressController.js";
import { imageUploader } from "../controller/fileUploader/multer.js";
// import { resizeUserPhoto } from "../controller/fileUploader/resizer.js";

export const userRouter = express.Router();

userRouter.use(protect);
userRouter.get("/me", getMe);
userRouter.patch("/update", imageUploader, updateMe);
userRouter.patch("/update-password", updatePassword);
userRouter.post("/setAddress", address);
userRouter.get("/getUserAddress", getAddress);
