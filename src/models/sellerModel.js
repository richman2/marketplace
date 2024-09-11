import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { User } from "./userModel.js";
export const Seller = sequelize.define("Seller", {
  _sellerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  storeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storeDescription: {
    type: DataTypes.STRING,
    allowNull: false,
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
    allowNull: false,
  },
  verificationStatus: {
    type: DataTypes.STRING,
    values: ["pending", "verified", "unverified", "rejected", "suspended", "under_investicatoin"],
    defaultValue: "pending",
    allowNull: false,
  },
  totalSales: {
    type: DataTypes.STRING,
    defaultValue: 0,
    allowNull: false,
  },
  _userId: {
    type: DataTypes.INTEGER,
    unique: true, // This enforces uniqueness on _userId
    allowNull: false,
    references: {
      model: User,
      key: "_userId",
    },
  },
});

