import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Seller } from "./sellerModel.js";

export const Product = sequelize.define("Product", {
  productId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

Seller.hasMany(Product);
Product.belongsTo(Seller);
