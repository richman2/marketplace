import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Order = sequelize.define("Order", {
  _orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  orderDate: {
    type: DataTypes.DATE,
  },
  totalAmount: {
    type: DataTypes.STRING,
  },
  subTotalAmount: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    values: ["Pending", "Processing", "Shipped", "Delivered", "Canceled", "returned"],
  },
  shippingMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingCost: {
    type: DataTypes.INTEGER,
  },
});

export const OrderNotif = sequelize.define("OrderNotif", {
  _notifId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  _sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  _orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(["unread", "read"]),
    defaultValue: "unread",
  },
});
