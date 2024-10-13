import express from "express";
import { checkCart, protect } from "../controller/guard/protect.js";
import { order } from "../controller/ordering/ordering.js";
import { paymenting } from "../controller/ordering/payment.js";

export const payRouter = express.Router();

payRouter.post("/takePayment", protect, checkCart, order, paymenting);
