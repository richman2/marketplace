import express from "express";
import {
  addManyToCat,
  addOneTOCat,
  deleteOneCat,
  findAllCat,
  findOneCat,
  updateOneCat,
} from "../controller/product/categoryController.js";
export const catRouter = express.Router();

catRouter.post("/add", addOneTOCat);
catRouter.post("/add/many", addManyToCat);
catRouter.get("/", findAllCat);
catRouter.get("/:id", findOneCat);
catRouter.delete("/del/:id", deleteOneCat);
catRouter.patch("/:id", updateOneCat);
