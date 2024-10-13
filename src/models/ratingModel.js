import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Rating = sequelize.define("Rating", {
  _ratingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  ratingSum: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
    allowNull: false,
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});
