import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Seller } from "./sellerModel.js";

export const Product = sequelize.define("Product", {
  _productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

Product.belongsTo(Seller, { foreignKey: "_sellerId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Seller.hasMany(Product, { foreignKey: "_sellerId" });
