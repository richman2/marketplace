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
  itemCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  payablePrice: {
    // total price with discount
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  itemsDiscount: {
    // discount
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  wdPrice: {
    // total price without discount
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

ShoppingCart.belongsToMany(Product, { through: CartItems, foreignKey: "_productId" });
ShoppingCart.belongsToMany(CartItems, { through: CartItems, foreignKey: "_cartId" });
ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
User.hasOne(ShoppingCart, { foreignKey: "_userId" });
ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
