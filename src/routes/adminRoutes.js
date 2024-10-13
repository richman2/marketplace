import express from "express";
import { protect } from "../controller/guard/protect.js";
import { createDiscount } from "../helper/discount.js";
import restrict from "../controller/guard/restrict.js";
import { addOneToCat, addManyToCat, updateOneCat, deleteOneCat } from "../categories/categoryController.js";
import { consumeNotifications, verifySeller } from "../controller/admin/notification.js";
import { createSeller } from "../controller/sellsers/sellerController.js";
import { addOneProd, deleteOneProd } from "../controller/product/prodController.js";
import { Category } from "../models/categoryModel.js";
export const adminRouter = express.Router();

adminRouter.use(protect, restrict(null, "manage", "admin"));

// apply discount
adminRouter.post("/discount", createDiscount);

adminRouter.get("/notifications", consumeNotifications);

adminRouter.post("/seller/add", createSeller);
adminRouter.patch("/verifySeller", verifySeller);

adminRouter.post("/product/add/cat/", addOneProd);

adminRouter.delete("/product/del/:id", deleteOneProd);
