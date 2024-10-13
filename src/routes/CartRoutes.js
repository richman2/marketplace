import express from "express";
import {
  addToCart,
  deleteCartItem,
  getCartItems,
  getCarts,
  updateCart,
} from "../controller/users/shopCartController.js";
import { checkCart, protect } from "../controller/guard/protect.js";
import { deleteRedisCache,} from "../helper/redisHelper.js";
import { ShoppingCart } from "../models/shoppingCart.js";

export const cartRouter = express.Router();

cartRouter.use([protect, checkCart]);
cartRouter.post("/add-to-cart", deleteRedisCache(ShoppingCart), addToCart);
cartRouter.patch("/updateCartItem", deleteRedisCache(ShoppingCart), updateCart);
cartRouter.get("/getCarts", getCarts);
cartRouter.get("/cartItems", getCartItems);
cartRouter.delete("/:itemId", deleteCartItem);
