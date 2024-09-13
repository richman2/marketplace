import { sequelize } from "./db.js";
import { DataTypes } from "sequelize.js";
import { Discount } from "./discount";

export const Coupon = sequelize.define("Coupon", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discount_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Discount,
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Specific user restriction
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  used_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
