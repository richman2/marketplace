import express from "express";
import { findAllOrders, getMyorders } from "../controller/ordering/ordering.js";
import { protect } from "../controller/guard/protect.js";
import restrict from "../controller/guard/restrict.js";

export const orderRouter = express.Router();

orderRouter.use(protect);
orderRouter.get("/getMyOrders", getMyorders);

orderRouter.use(restrict(null, "manage", "admin"));
orderRouter.get("/getOrders", findAllOrders);
