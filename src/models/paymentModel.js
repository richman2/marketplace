import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Buyer } from "./buyerModel.js";
import { Order } from "./orderModel.js";

export const Payment = sequelize.define("Paymen", {
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
  transactionId: {
    type: DataTypes.CHAR(100),
  },
});

Payment.belongsTo(Buyer);
Payment.belongsTo(Order);
