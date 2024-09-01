import express from "express";
import { addManyToCat, addOneTOCat, findAllCat } from "../controller/product/categoryController.js";
export const catRoutes = express.Router();

catRoutes.post("/add", addOneTOCat);
catRoutes.post("/add/:many", addManyToCat);
catRoutes.post("/", findAllCat);
