import express from "express";
import { checkSeller, protect } from "../controller/guard/protect.js";
import { addDiscount, applyProductDiscount, getMyDiscount } from "../controller/discount/productDisc.js";
import restrict from "../controller/guard/restrict.js";

export const discountRouter = express.Router();

discountRouter.use(protect, checkSeller);
discountRouter.post("/apply", checkSeller, addDiscount);
discountRouter.post("/apply/product", checkSeller, applyProductDiscount);
discountRouter.get("/mydiscount", getMyDiscount);
