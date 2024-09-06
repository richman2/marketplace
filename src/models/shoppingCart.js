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
  payablePrice: {
    // total price with discount
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    // discount
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPrice: {
    // total price without discount
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

// ShoppingCart.hasMany(CartItems, { foreignKey: "_cartId", unique: true });
// CartItems.belongsTo(ShoppingCart, { foreignKey: "_cartId" });
// Product.hasOne(CartItems, { foreignKey: "_productId" });
// CartItems.belongsTo(Product, { foreignKey: "_productId" });
ShoppingCart.belongsToMany(Product, { through: CartItems, foreignKey: "_cartId" });
Product.belongsToMany(ShoppingCart, { through: CartItems, foreignKey: "_productId" });
// ShoppingCart.belongsToMany(CartItems, { through: CartItems});
ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
User.hasOne(ShoppingCart, { foreignKey: "_userId" });
ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
