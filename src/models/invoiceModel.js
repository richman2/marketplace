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
  dueDate: {
    type: DataTypes.DATE,
  },
  totalAmount:{
    type: DataTypes.INTEGER
  },
  paymentDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING,
  },
});

