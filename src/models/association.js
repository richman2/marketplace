import { ShoppingCart } from "./shoppingCart.js";
import { Product } from "./productModel.js";
import { Seller } from "./sellerModel.js";
import { User } from "./userModel.js";
import { Province } from "./province.js";
import { City } from "./citiesModel.js";
import { Category } from "./categoryModel.js";
import { Invoice } from "./invoiceModel.js";
import { Order } from "./orderModel.js";
import { Address } from "./addressModel.js";
import { CartItems } from "./shoppingCartItem.js";
import { Payment } from "./paymentModel.js";

export const association = null;
ShoppingCart.belongsToMany(Product, { through: CartItems, foreignKey: "_cartId", onDelete: "CASCADE" });
Product.belongsToMany(ShoppingCart, { through: CartItems, foreignKey: "_productId", onDelete: "CASCADE" });
ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
User.hasOne(ShoppingCart, { foreignKey: "_userId" });
ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
User.hasOne(Seller, { foreignKey: "_userId", unique: true });
Seller.belongsTo(User, { foreignKey: "_userId" });
Seller.hasMany(Invoice, { foreignKey: "_sellerId" });
Invoice.belongsTo(Seller, { foreignKey: "_sellerId" });
Province.hasMany(City, { foreignKey: "_provId" });
City.belongsTo(Province, { foreignKey: "_provId" });
Category.hasMany(Product, { foreignKey: "_categoryId", onUpdate: "CASCADE" });
Category.belongsTo(Category, { as: "parent", foreignKey: "_parentId" });
Category.hasMany(Category, { as: "children", foreignKey: "_parentId" });
User.hasMany(Invoice, { foreignKey: "_userId" });
Invoice.belongsTo(User, { foreignKey: "_userId" });
Order.hasOne(Invoice, { foreignKey: "_orderId" });
Order.belongsTo(User, {foreignKey: "_userId"})
User.hasMany(Order, {foreignKey: "_userId"})
Invoice.belongsTo(Order, { foreignKey: "_orderId" });
Product.belongsTo(Seller, { foreignKey: "_sellerId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Seller.hasMany(Product, { foreignKey: "_sellerId" });
User.hasOne(Address, { foreignKey: "_userId" });
Address.belongsTo(User, { foreignKey: "_userId" });
Payment.belongsTo(Order);
Order.hasOne(Payment)