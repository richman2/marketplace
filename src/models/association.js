import { ShoppingCart } from "./shoppingCart.js";
import { Product } from "./productModel.js";
import { Seller } from "./sellerModel.js";
import { User } from "./userModel.js";
import { Province } from "./province.js";
import { City } from "./citiesModel.js";
import { Category } from "./categoryModel.js";
import { Invoice, InvoiceItem } from "./invoiceModel.js";
import { Order, OrderNotif } from "./orderModel.js";
import { Address } from "./addressModel.js";
import { CartItems } from "./shoppingCartItem.js";
import { Transaction } from "./paymentModel.js";
import { OrderItem } from "./orderItemModel.js";
import { Discount, ProductDiscount } from "./discount.js";
import { Review, SellerResponse } from "./reviewModel.js";
import { Rating } from "./ratingModel.js";
// import { DiscountApplied } from "./discountApplied.js";

export const association = null;
ShoppingCart.belongsToMany(Product, { through: CartItems, foreignKey: "_cartId", onDelete: "CASCADE" });
Product.belongsToMany(ShoppingCart, { through: CartItems, foreignKey: "_productId", onDelete: "CASCADE" });

Order.belongsToMany(Product, { through: OrderItem, foreignKey: "_orderId", onDelete: 'CASCADE' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: "_productId", onDelete: 'CASCADE' });

ShoppingCart.belongsTo(User, { foreignKey: "_userId" });
User.hasOne(ShoppingCart, { foreignKey: "_userId" });

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

Order.belongsTo(User, { foreignKey: "_userId" });
User.hasMany(Order, { foreignKey: "_userId" });

Order.hasOne(Invoice, { foreignKey: "_orderId" });
Invoice.belongsTo(Order, { foreignKey: "_orderId" });

Product.belongsTo(Seller, { foreignKey: "_sellerId", onDelete: "CASCADE", onUpdate: "SET NULL" });
Seller.hasMany(Product, { foreignKey: "_sellerId" });

User.hasMany(Address, { foreignKey: "_userId" });
Address.belongsTo(User, { foreignKey: "_userId" });

Transaction.belongsTo(Order, { foreignKey: "_orderId" });
Order.hasOne(Transaction, { foreignKey: "_orderId" });

Discount.hasMany(ProductDiscount, { foreignKey: "_discountId" });
ProductDiscount.belongsTo(Discount, { foreignKey: "_discountId" });

Product.hasOne(ProductDiscount, { foreignKey: "_productId", onDelete: 'CASCADE'});
ProductDiscount.belongsTo(Product, { foreignKey: "_productId" });

Seller.hasMany(Discount, { foreignKey: "_sellerId" });
Discount.belongsTo(Seller, { foreignKey: "_sellerId" });

Product.hasMany(Review, { foreignKey: "_productId", onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: "_productId" });

User.hasMany(Review, { foreignKey: "_userId" });
Review.belongsTo(User, { foreignKey: "_userId" });

Review.hasOne(SellerResponse, { foreignKey: "_reviewId" });
SellerResponse.belongsTo(Review, { foreignKey: "_reviewId" });

Product.hasOne(Rating, { foreignKey: "_productId", onDelete: 'CASCADE' });
Rating.belongsTo(Product, { foreignKey: "_productId" });

Seller.hasMany(OrderNotif, { foreignKey: "_sellerId" });
OrderNotif.belongsTo(Seller, { foreignKey: "_sellerId" });

Invoice.hasMany(InvoiceItem, { foreignKey: "_invoiceId" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "_invoiceId" });
