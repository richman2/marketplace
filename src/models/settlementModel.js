import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const settlement = sequelize.define("Settlement", {
  _settlementId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  settlementDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amounts: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(["settled", "unsettled"]),
  },
});
