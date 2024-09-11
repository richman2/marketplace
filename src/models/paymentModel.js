import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Payment = sequelize.define("Payment", {
  _paymentId: {
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
  getwayResponse: {
    type: DataTypes.CHAR(100),
  },
});
