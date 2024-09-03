import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Product } from "./productModel.js";

export const Category = sequelize.define("Category", {
  _categoryId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Category.hasMany(Product, { foreignKey: "_categoryId", onUpdate: "CASCADE" });
