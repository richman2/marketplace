import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Province = sequelize.define("Province", {
  _provId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  provName:{
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "available",
    values: ["available", "unavailable"],
  },
});

