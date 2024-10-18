import express from "express";
import { createSeller, findMe, findOneSeller, updateSeller } from "../controller/sellsers/sellerController.js";
import { checkSeller, protect } from "../controller/guard/protect.js";
import restrict from "../controller/guard/restrict.js";

export const sellerRouter = express.Router();

sellerRouter.use(protect);
sellerRouter.post("/add", createSeller);

sellerRouter.get("/me", checkSeller, findMe);
sellerRouter.patch("/update/me", checkSeller, updateSeller);

sellerRouter.use(restrict(null, "manage", "admin"));
sellerRouter.get("/id/:id", findOneSeller);
