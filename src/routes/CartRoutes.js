import express from "express";
import { addToCart, getCarts, updateCart } from "../controller/users/shopCartController.js";
import { protect } from "../controller/guard/protect.js";
import { deleteRedisCache, findRedisCache, setRedisCache } from "../helper/redisHelper.js";
import { ShoppingCart } from "../models/shoppingCart.js";

export const cartRouter = express.Router();

cartRouter.post("/add-to-cart", protect, deleteRedisCache(ShoppingCart), addToCart);
cartRouter.patch("/updateCartItem", protect, deleteRedisCache(ShoppingCart), updateCart);
cartRouter.get("/getCarts", protect, findRedisCache(ShoppingCart), getCarts, setRedisCache(ShoppingCart));
