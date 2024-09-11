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
  orderStatus: {
    type: DataTypes.STRING,
  },
  paymenStatus: {
    type: DataTypes.STRING,
  },
  paymenMethod: {
    type: DataTypes.STRING,
  },
  shippingMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
});
