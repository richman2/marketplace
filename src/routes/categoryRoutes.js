import express from "express";
import {
  addManyToCat,
  addOneCategory,
  addOneToCat,
  deleteOneCat,
  findAllChildCategory,
  findOneCat,
} from "../controller/categories/categoryController.js";
import restrict from "../controller/guard/restrict.js";
import { updateCart } from "../controller/users/shopCartController.js";
import { protect } from "../controller/guard/protect.js";

export const catRouter = express.Router();

catRouter.get("/", findAllChildCategory);
catRouter.get("/find/:id", findOneCat);

// only admin can do
catRouter.use(protect, restrict(null, "manage", "admin"));
catRouter.post("/add", addOneCategory);
catRouter.post("/add/many", addManyToCat);
// catRouter.get("/", findAllCat);

catRouter.delete("/del/:id", deleteOneCat);
catRouter.patch("/edit/:id", updateCart);
