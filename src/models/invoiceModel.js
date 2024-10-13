import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Invoice = sequelize.define("Invoice", {
  _invoiceId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  invoiceDate: {
    type: DataTypes.DATE,
  },
  paymentDate: {
    type: DataTypes.DATE,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  subTotalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(["pending", "complete"]),
    defaultValue: "pending",
  },
});

export const InvoiceItem = sequelize.define("InvoiceItem", {
  _invoiceItemId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priceWithDiscount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
