import express from "express";
import { addToCart, createCartIfDoesNotExist, getCarts, updateCart } from "../controller/users/shopCartController.js";
import { protect } from "../controller/guard/protect.js";

export const cartRouter = express.Router();

cartRouter.post("/add-to-cart", protect, createCartIfDoesNotExist, addToCart);
cartRouter.patch("/updateCartItem", protect, createCartIfDoesNotExist, updateCart);
cartRouter.get("/getCarts", protect, createCartIfDoesNotExist, getCarts);
