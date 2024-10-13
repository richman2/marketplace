// import catchAsync from "../../utils/catchAsync.js";
import { Invoice } from "../../models/invoiceModel.js";
import { Order, OrderNotif } from "../../models/orderModel.js";
import { Product } from "../../models/productModel.js";
import groupProductsByseller from "./helper/groupProductsByseller.js";
import { calcDiscount } from "../product/helper.js";
import Query from "../../utils/queryApi.js";
import { Discount, ProductDiscount } from "../../models/discount.js";
import { Address } from "../../models/addressModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

export const createInvoice = async (orderId, userId) => {
  const query = new Query().filter({ _orderId: orderId }).includeOption(
    1,
    [3],
    [
      [
        [
          Product,
          { as: "Item", attributes: ["_orderItemId", "quantity", "price"] },
          null,
          ["_sellerId", "_productId", "productName"],
          null,
        ],
        [ProductDiscount, null, null, ["id"], null],
        [Discount, null, null, ["value", "discountType"], null],
      ],
    ]
  );

  query.option.attributes = ["_orderId"];
  const orders = await Order.findOne(query.option);
  const userAddress = await Address.findOne({
    where: { _userId: userId },
    attributes: ["address"],
  });
  const Item = orders.get("Products").map((el) => {
    el = el.get({ plain: true });
    el.Item.unitPrice = el.Item.price / el.Item.quantity;
    el.Item.productName = el.productName;
    el.Item._productId = el._productId;

    el.Item.discountValue = el.ProductDiscount?.Discount.value ?? null;

    const value = el.ProductDiscount?.Discount?.value;
    const type = el.ProductDiscount?.Discount?.discountType;
    el.Item.priceWithDiscount = calcDiscount(el.Item.price / el.Item.quantity, value, type) * el.Item.quantity ?? null;
    return {
      _sellerId: el._sellerId,
      items: el.Item,
    };
  });
  const groupedSellerProducts = groupProductsByseller(Item);
  const separatedEachSellerProduct = Object.entries(groupedSellerProducts);

  const invoices = [];
  const notif = [];
  const invoiceItems = [];
  separatedEachSellerProduct.forEach((el) => {
    notif.push({
      _sellerId: +el[0],
      _orderId: orders.get("_orderId"),
      message: "a buyer placed an order check your panel",
      status: "unread",
    });

    el[1].forEach((innerEl) => {
      invoiceItems.push(innerEl.items);
    });

    let totalAmount = 0;
    let subTotal = 0;
    invoiceItems.forEach((innerEl) => {
      innerEl.priceWithDiscount ? (totalAmount += innerEl.priceWithDiscount) : (totalAmount += innerEl.price);
      subTotal += innerEl.price;
    });
    invoices.push({
      invoiceDate: Date.now(),
      paymentDate: Date.now(),
      _userId: 1,
      _orderId: orders.get("_orderId"),
      _sellerId: +el[0],
      totalAmount: totalAmount,
      subTotalAmount: subTotal,
      shippingAddress: userAddress.get("address"),
      status: "pending",
      items: invoiceItems,
    });
  });
  await OrderNotif.bulkCreate(notif);
  await Invoice.bulkCreate(invoices);
  return invoices;
};

export const getInvoices = catchAsync(async (req, res, next) => {
  let invoice; // default undefined if no invoice found
  let invoices = []; // default an empty list if no invoices found
  let userType; // only seller or user can find them invoices (_userId or _sellerId)
  let id; // will be set to seller id or user id
  let _invoiceId; // if an invoiceId become from query input

  req.query.as === "seller" ? (userType = "_sellerId") : (userType = "_userId");

  if (userType === "_sellerId") {
    const seller = await req.user?.getSeller();
    seller?.get("_sellerId") ? (id = seller?.get("_sellerId")) : (id = null);
  } else {
    id = req.user.get("_userId");
  }

  +req.query.invoiceId ? (_invoiceId = +req.query.invoiceId) : (_invoiceId = null);

  const filter = {
    where: { [userType]: id ?? null },
  };

  if (_invoiceId) {
    filter.where._invoiceId = _invoiceId;
    invoice = await Invoice.findOne(filter);
  } else {
    console.log(filter);
    invoices = await Invoice.findAll(filter);
  }
  if (!invoice && !invoices.length) return next(new ErrorApi("پیدا نشد", 404));
  res.status(200).json(invoice ?? invoices);
});
