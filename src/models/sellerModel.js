import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { User } from "./userModel.js";
import { Invoice } from "./invoiceModel.js";

export const Seller = sequelize.define("Seller", {
  sellerId: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: User,
      key: "userId",
    },
  },
  storeName: {
    type: DataTypes.STRING,
  },
  storeDescription: {
    type: DataTypes.STRING,
  },
  storeLogo: {
    type: DataTypes.STRING,
  },
  paymentDetails: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.STRING,
  },
  storePhone: {
    type: DataTypes.STRING,
  },
  verificationStatu: {
    type: DataTypes.STRING,
  },
  totalSales: {
    type: DataTypes.STRING,
  },
});

User.hasOne(Seller, { foreignKey: "userId" });
Seller.belongsTo(User, { foreignKey: "userId" });
Seller.hasMany(Invoice);
