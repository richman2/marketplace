import express from "express";
import { protect } from "../controller/guard/protect.js";
import { createDiscount } from "../helper/discount.js";
import restrict from "../controller/guard/restrict.js";
import { addOneToCat, addManyToCat, updateOneCat, deleteOneCat } from "../controller/categories/categoryController.js";
import { createSeller } from "../controller/sellsers/sellerController.js";
import { addOneProd, deleteOneProd } from "../controller/product/prodController.js";
import { Category } from "../models/categoryModel.js";
export const adminRouter = express.Router();

