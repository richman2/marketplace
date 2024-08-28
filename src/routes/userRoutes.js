import express from "express";
import { getMe, login, protect, signUp } from "../controller/auth/authentication.js";
export const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/getme", protect, getMe);
