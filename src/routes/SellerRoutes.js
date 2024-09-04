import express from "express";
import { createSeller, findOneSeller } from "../controller/users/sellerController.js";
import { protect } from "../controller/guard/protect.js";

export const sellerRouter = express.Router();

sellerRouter.post("/add", protect, createSeller);
sellerRouter.get("/:id", protect, findOneSeller);
