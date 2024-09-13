import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const OrderItem = sequelize.define("OrderItem", {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
});
