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
