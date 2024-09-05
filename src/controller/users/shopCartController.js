import { ShoppingCart } from "../../models/shoppingCart.js";
import { CartItems } from "../../models/shoppingCartItem.js";
import { User } from "../../models/userModel.js";
import { Buyer } from "../../models/buyerModel.js";
import catchAsync from "../../utils/catchAsync.js";

export const createCartIfDoesNotExist = catchAsync(async (req, res, next) => {
  const isThereCart = await req.user.getCart();
  req.cart = isThereCart;
  if (!isThereCart) {
    const createdCart = await req.user.createCart();
    req.cart = createdCart;
  }

  next();
});

export const addToCart = catchAsync(async (req, res, next) => {
  
  console.log(req.cart);
  res.send("ok");
});
