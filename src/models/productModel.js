import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Product = sequelize.define("Product", {
  _productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING,
    validate: {
      is: { args: /^[a-zA-Z ]+[^ ]$/i, msg: "don't use space before and after the productName" },
    },
    allowNull: false,
  },
  description: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
  salesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
});
