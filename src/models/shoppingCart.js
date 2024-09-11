import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const ShoppingCart = sequelize.define("Cart", {
  _cartId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});
