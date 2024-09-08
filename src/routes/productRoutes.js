import express from "express";
import { addOneProd, deleteOneProd, findProds } from "../controller/product/prodController.js";
import { protect } from "../controller/guard/protect.js";
import { deleteRedisCache } from "../helper/redisHelper.js";
import { ShoppingCart } from "../models/shoppingCart.js";
export const prodRouter = express.Router();

prodRouter.post("/add/cat/:id", protect, addOneProd);
// prodRouter.post("/add/many", addManyProd);
prodRouter.get("/:id", findProds);
prodRouter.delete("/del/:id", protect, deleteRedisCache(ShoppingCart), deleteOneProd);
