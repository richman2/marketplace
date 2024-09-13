import express from "express";
import { protect } from "../controller/guard/protect.js";
import { createDiscount, createDiscountApply } from "../helper/discount.js";
import restrict from "../controller/guard/restrict.js";
import { consumeNotifications } from "../controller/admin/notification.js";

export const adminRouter = express.Router();

adminRouter.use(protect, restrict(null, "manage"));

// apply discount
adminRouter.post("/discount", createDiscount);
adminRouter.post("/applicableDiscount", createDiscountApply);
adminRouter.get("/notifications", consumeNotifications);
