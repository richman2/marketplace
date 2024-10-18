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
import { deleteRedisCache } from "../helper/redisHelper.js";
import { ShoppingCart } from "../models/shoppingCart.js";
import { Product } from "../models/productModel.js";
import restrict from "../controller/guard/restrict.js";
import { rating } from "../controller/product/ratingController.js";
import { resizeUserPhoto } from "../controller/fileUploader/resizer.js";
import { photoUploader } from "../controller/fileUploader/multer.js";
export const prodRouter = express.Router();

prodRouter.get("/search", search);
prodRouter.get("/id/:id", findOneProd);
prodRouter.get("/categories/:name", findProds);

prodRouter.use(protect, checkSeller);


prodRouter.get("/myProducts", findMyProduct);
prodRouter.use(deleteRedisCache(Product));
prodRouter.post("/add/", photoUploader, resizeUserPhoto("products"), addOneProd);
prodRouter.delete("/del/:id", restrict(Product, "delete"), deleteOneProd);
prodRouter.patch("/update/:id", restrict(Product, "update"), photoUploader, resizeUserPhoto("products"), updateOnePro);
