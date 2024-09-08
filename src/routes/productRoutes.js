import express from "express";
import { addOneProd, deleteOneProd, findOneProd, findProds } from "../controller/product/prodController.js";
import { protect } from "../controller/guard/protect.js";
import { deleteRedisCache, findRedisCache, setRedisCache } from "../helper/redisHelper.js";
import { ShoppingCart } from "../models/shoppingCart.js";
import { Product } from "../models/productModel.js";
export const prodRouter = express.Router();

prodRouter.post("/add/cat/:name", protect, deleteRedisCache(Product), addOneProd, setRedisCache(Product));
prodRouter.get("/:name", findOneProd);
prodRouter.get("/categories/:name", findRedisCache(Product), findProds);
prodRouter.delete("/del/:id", protect, deleteRedisCache(ShoppingCart), deleteOneProd, deleteRedisCache(Product));
