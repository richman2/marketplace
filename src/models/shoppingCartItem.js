import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const CartItems = sequelize.define("CartItem", {
  _cartItemId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

