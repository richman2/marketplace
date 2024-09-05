import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Invoice } from "./invoiceModel.js";

export const Buyer = sequelize.define("Buyer", {
  _buyerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  point: {
    type: DataTypes.STRING,
  },
});

Buyer.hasMany(Invoice, { foreignKey: "_buyerId" });
Invoice.belongsTo(Buyer, { foreignKey: "_buyerId" });
