import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Product } from "./productModel.js";

export const Category = sequelize.define("Category", {
  _categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Category.hasMany(Product);
