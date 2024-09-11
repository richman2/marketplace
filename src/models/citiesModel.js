import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const City = sequelize.define("City", {
  _cityId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "available",
    values: ["available", "unavailable"],
  },
});


