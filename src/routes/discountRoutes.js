import express from "express";
import { checkSeller, protect } from "../controller/guard/protect.js";
import {
  addDiscount,
  applyProductDiscount,
  deleteDiscount,
  getMyDiscount,
  updateDiscount,
} from "../controller/discount/productDisc.js";
import restrict from "../controller/guard/restrict.js";
import { Discount } from "../models/discount.js";

export const discountRouter = express.Router();

discountRouter.use(protect, checkSeller);
discountRouter.post("/apply", checkSeller, addDiscount);
discountRouter.post("/apply/product", checkSeller, applyProductDiscount);
discountRouter.get("/mydiscounts", getMyDiscount);

discountRouter.patch("/update/:id", restrict(Discount, "update"), updateDiscount);
discountRouter.delete("/del/:id", restrict(Discount, "delete", deleteDiscount));
