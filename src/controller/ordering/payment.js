import { Op } from "sequelize";
import { OrderItem } from "../../models/orderItemModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import { Transaction } from "../../models/paymentModel.js";
import { EventEmitter } from "node:events";
import { Order, OrderNotif } from "../../models/orderModel.js";
import { Product } from "../../models/productModel.js";
import ZarinPal, { zarinConfig } from "./helper/ZarinPal.js";
import rollbackData from "./helper/rollbackData.js";
import groupProductsByseller from "./helper/groupProductsByseller.js";
import Query from "../../utils/queryApi.js";
import { User } from "../../models/userModel.js";
import { createInvoice } from "./invoice.js";

const event = new EventEmitter();

event.on("deleteTransaction", async (id) => {
  await Transaction.destroy({ where: { gatewayResponse: id } });
});

event.on("verify phase", async (id) => {
  const transaction = await Transaction.findOne({ where: { getwayResponse: id } });
  const orderItem = await OrderItem.findAll({ where: { _orderId: transaction.get("_orderId") } });
  await rollbackData(orderItem.map((el) => [el.get("_productId"), el.get("quantity")]));
});

event.on("paymenting request phase", async (id) => {
  const orderItem = await OrderItem.findAll({ where: { _orderId: id } });
  await Transaction.destroy({ where: { _orderId: id } });
  await rollbackData(orderItem.map((el) => [el.get("_productId"), el.get("quantity")]));
});

event.on("successPayment", async (obj) => {
  await Order.update({ status: "Processing" }, { where: { _orderId: obj.order.dataValues._orderId } });


  await createInvoice(obj.order.get("_orderId"), obj.order.get("User").get("_userId"));

});

export const paymenting = catchAsync(async (req, res, next) => {
  const zarinpal = new ZarinPal("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", true, "IRT");

  try {
    const request = await zarinpal.paymentRequest({
      amount: req.totalAmount,
      callback_url: "http://192.168.1.5:3000/payment/verify",
      description: "Ordering",
      metadata: { order_id: req.orderId },
    });

    const response = await request.json();
    // console.log("=================================");
    // console.log(response);
    // console.log("=================================");

    await Transaction.create({
      getwayResponse: response.authority,
      status: "pending",
      _orderId: req.orderId,
    });
    res.redirect(`${zarinConfig.PG(true)}${response.authority}`);
  } catch (err) {
    // roll backe product data to database
    event.emit("paymenting request phase", req.orderId);
    return next(new ErrorApi("ارتباط با درگاه پرداخت امکان پذیر نبود لطفا به پشتیبانی سایت گزارش دهید", 422));
  }
});

export const verify = catchAsync(async (req, res, next) => {
  const { authority, status } = req.query;

  if (status === "OK") {
    // verify payment
    const payment = await Transaction.findOne({ where: { gatewayResponse: authority } });
    const query = new Query()
      .filter({ _orderId: payment.get("_orderId") })
      .includeOption(
        2,
        [3, 1],
        [
          [[Product, { as: "Item", attributes: ["_id"] }, null, ["_sellerId"], null]],
          [[User, null, null, ["_userId"], null]],
        ]
      );

    const order = await Order.findOne(query.option);
    const totalAmount = order.get("totalAmount");
    const zarinpal = new ZarinPal("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", true, "IRT");
    try {
      const verifyResponse = await zarinpal.paymentVerification({
        merchamerchandId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        authority,
        amount: totalAmount,
      });

      if (verifyResponse.status.code === 100 || verifyResponse.status.code === 101) {
        event.emit("successPayment", { order, _userId: req.user.get("_userId") });
        event.emit("deleteTransaction", authority);
        res.status(200).json({
          message: "success",
        });
      } else {
        throw { errors: verifyResponse.errors };
      }
    } catch (err) {
      await rollbackData(order.get("Products").map((el) => [el.get("_productId"), el.dataValues.Item.quantity]));
      event.emit("deleteTransaction", authority);
      return res.status(500).json({
        error: err,
      });
    }
  } else {
    event.emit("verify phase", authority);
    event.emit("deleteTransaction", authority);
    return res.status(500).json({
      error: "Failed",
    });
  }
});
