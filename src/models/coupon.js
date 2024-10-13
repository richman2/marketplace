import { sequelize } from "./db.js";
import { DataTypes } from "sequelize.js";
import { Discount } from "./discount";

export const Coupon = sequelize.define("Coupon", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  _userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Specific user restriction
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
