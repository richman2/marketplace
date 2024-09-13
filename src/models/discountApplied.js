import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Discount } from "./discount.js";

export const DiscountApplied = sequelize.define("DiscountApplied", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  _productId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Applies to a specific product
  },
  _categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Applies to a specific category
  },
  _userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Applies to a specific user
  },
  minCartValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0, // Minimum cart value to apply discount
  },
  maxUses: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
