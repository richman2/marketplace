import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { CartItems } from "./shoppingCartItem.js";
import { Buyer } from "./buyerModel.js";

export const ShoppingCart = sequelize.define("Cart", {
  _cartId: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  bueryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Buyer,
      key: "_buyerId",
    },
  },
  itemCount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payablePrice: {
    // total price with discount
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  itemsDiscount: {
    // discount
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  wdPrice: {
    // total price without discount
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

ShoppingCart.hasMany(CartItems);
ShoppingCart.belongsTo(Buyer);
