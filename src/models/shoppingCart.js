import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Product } from "./productModel.js";
import { CartItems } from "./shoppingCartItem.js";
import { User } from "./userModel.js";
export const ShoppingCart = sequelize.define("Cart", {
  _cartId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

ShoppingCart.belongsToMany(Product, { through: CartItems, foreignKey: "_cartId", onDelete: "CASCADE" });
Product.belongsToMany(ShoppingCart, { through: CartItems, foreignKey: "_productId", onDelete: "CASCADE" });
ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
User.hasOne(ShoppingCart, { foreignKey: "_userId" });
ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
