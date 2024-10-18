import { Op } from "sequelize";
import { Discount, ProductDiscount } from "../../models/discount.js";
import { OrderItem } from "../../models/orderItemModel.js";
import { Order, OrderNotif } from "../../models/orderModel.js";
import { Product } from "../../models/productModel.js";
import { ShoppingCart } from "../../models/shoppingCart.js";
import { CartItems } from "../../models/shoppingCartItem.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import { calcDiscount, hasDiscount } from "../product/helper.js";
import decreaseProductStock from "./helper/decreaseProductStock.js";
import Query from "../../utils/queryApi.js";
import { User } from "../../models/userModel.js";
import { Address } from "../../models/addressModel.js";
import groupProductsByseller from "./helper/groupProductsByseller.js";
import { Invoice } from "../../models/invoiceModel.js";
import { createInvoice } from "./invoice.js";

export const order = catchAsync(async (req, res, next) => {
  // get cartId from shopping Cart table
  // const _cartId = await req.cart.get("_cartId");

  const invoices = await createInvoice(2, 1);
  res.status(200).json(invoices);
  
  const cart = await ShoppingCart.findOne({
    where: { _cartId },
    include: [
      {
        model: Product,
        through: { attributes: ["quantity", "price", "_productId"] },
        attributes: ["_productId"],
        include: [
          {
            model: ProductDiscount,
            attributes: ["id"],
            include: [{ model: Discount, attributes: ["value", "discountType"] }],
          },
        ],
      },
      { model: User, attributes: ["_userId"], include: { model: Address } },
    ],
  });

  if (!cart.get({ plain: true }).User.Addresses.length) throw new ErrorApi("error");

  if (!cart.get("Products").length) return next(new ErrorApi("هیچ آیتمی در سبد خرید شما وجود ندارد", 404));

  const subTotal = await CartItems.sum("price", {
    where: { _productId: cart.get("Products").map((el) => el.get("_productId")) },
  });
  const totalAmount = hasDiscount(cart) || subTotal;

  await decreaseProductStock(cart.get("Products").map((el) => [el.get("_productId"), el.dataValues.Item.quantity]));

  const order = await req.user.createOrder({
    orderDate: Date.now(),
    status: "pending",
    totalAmount,
    subTotalAmount: subTotal,
    shippingMethod: "peyk",
    shippingCost: 100000,
  });
  const arrayOfItems = cart.get("Products").map((el) => {
    return {
      _orderId: order.get("_orderId"),
      _productId: el.get("_productId"),
      quantity: el.dataValues.Item.quantity,
      price: el.dataValues.Item.price,
      discount: el.ProductDiscount?.Discount.value ?? 0,
    };
  });

  await OrderItem.bulkCreate(arrayOfItems);

  req.orderId = order.get("_orderId");
  req.totalAmount = totalAmount;
  req.subTotal = subTotal;
  // res.status(200).json(items);
  next();
});

export const getMyorders = catchAsync(async (req, res, next) => {
  const orders = await Order.findAll({ where: { _userId: req.user.get("_userId") } });
  res.status(200).json(orders);
});

export const findAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.findAll();
  res.status(200).json(orders);
});
