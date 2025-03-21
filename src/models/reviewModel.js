import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Review = sequelize.define("Review", {
  _reviewId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(["approved", "reject", "pending"]),
  },
});

export const SellerResponse = sequelize.define("SellerRespons", {
  _responseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  response: {
    type: DataTypes.TEXT,
  },
});
