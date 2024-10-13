import express from "express";
import { findAllOrders, getMyorders } from "../controller/ordering/ordering";
import { protect } from "../controller/guard/protect";
import restrict from "../controller/guard/restrict";

export const orderRouter = express.Router();

orderRouter.use(protect);
orderRouter.get("/getMyOrder", getMyorders);

orderRouter.use(restrict(null, "manage", "admin"));
orderRouter.get("/getOrders", findAllOrders);
