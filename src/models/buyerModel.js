import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User } from "./userModel.js";
import { Invoice } from "./invoiceModel.js";

export const Buyer = sequelize.define("Buyer", {
  _buerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "_userId",
    },
  },
  point: {
    type: DataTypes.STRING,
  },
});

Buyer.hasMany(Invoice);
