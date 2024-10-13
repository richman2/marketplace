import express from "express";
import {
  addOneProd,
  deleteOneProd,
  findMyProduct,
  findOneProd,
  findProds,
  search,
  updateOnePro,
} from "../controller/product/prodController.js";
import { checkSeller, protect } from "../controller/guard/protect.js";
import { deleteRedisCache} from "../helper/redisHelper.js";
import { ShoppingCart } from "../models/shoppingCart.js";
import { Product } from "../models/productModel.js";
import restrict from "../controller/guard/restrict.js";
import { rating } from "../controller/product/ratingController.js";
export const prodRouter = express.Router();

prodRouter.get("/search", search);
prodRouter.get("/id/:id", findOneProd);
prodRouter.get("/categories/:name", findProds);

prodRouter.use([protect, checkSeller]);

prodRouter.post("/add/cat", addOneProd);
prodRouter.get("/myProduct", findMyProduct);
prodRouter.use(deleteRedisCache(Product));
prodRouter.delete("/del/:id", restrict(Product, "delete"), deleteOneProd);
prodRouter.patch("/update", updateOnePro);
