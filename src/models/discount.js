import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Product } from "./productModel.js";

export const Discount = sequelize.define("Discount", {
  _discountId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  discountName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountType: {
    type: DataTypes.ENUM("percentage", "fixed"),
    allowNull: false,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
  },
  usageCount: {
    type: DataTypes.INTEGER,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export const ProductDiscount = sequelize.define("ProductDiscount", {});
