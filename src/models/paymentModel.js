import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Transaction = sequelize.define("Transaction", {
  _transactionId: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gatewayResponse: {
    type: DataTypes.CHAR(100),
  },
});
