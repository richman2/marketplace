import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Invoice } from "./invoiceModel.js";

export const Order = sequelize.define("Order", {
  _orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  orderDate: {
    type: DataTypes.DATE,
  },
  totalAmount: {
    type: DataTypes.STRING,
  },
  orderStatus: {
    type: DataTypes.STRING,
  },
  paymenStatus: {
    type: DataTypes.STRING,
  },
  paymenMethod: {
    type: DataTypes.STRING,
  },
});

Order.hasOne(Invoice);
