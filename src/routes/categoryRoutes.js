import express from "express";
import {
  addManyToCat,
  addOneToCat,
  deleteOneCat,
  findAllChildCategory,
  findOneCat,
  updateOneCat,
} from "../controller/product/categoryController.js";
import restrict from "../controller/guard/restrict.js";
import { Category } from "../models/categoryModel.js";
import { protect } from "../controller/guard/protect.js";
export const catRouter = express.Router();

catRouter.get("/", findAllChildCategory);
catRouter.get("/:id", findOneCat);
catRouter.use([protect, restrict(Category, "manage")]);
catRouter.post("/add", addOneToCat);
catRouter.post("/add/many", addManyToCat);
// catRouter.get("/", findAllCat);

catRouter.delete("/del/:id", deleteOneCat);
catRouter.patch("/:id", updateOneCat);
