import express from "express";
import { addToCart, createCartIfDoesNotExist } from "../controller/users/shopCartController.js";
import { protect } from "../controller/guard/protect.js";

export const cartRouter = express.Router();

cartRouter.post("/add-to-cart", protect, createCartIfDoesNotExist, addToCart);
