import express from "express";
import {
  addManyToCat,
  addOneToCat,
  deleteOneCat,
  findAllChildCategory,
  findOneCat,
  updateOneCat,
} from "../controller/product/categoryController.js";
export const catRouter = express.Router();

catRouter.post("/add", addOneToCat);
catRouter.post("/add/many", addManyToCat);
// catRouter.get("/", findAllCat);
catRouter.get("/", findAllChildCategory);
catRouter.get("/:id", findOneCat);
catRouter.delete("/del/:id", deleteOneCat);
catRouter.patch("/:id", updateOneCat);
