import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const CartItems = sequelize.define("Item", {
  _cartItemId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  price: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

