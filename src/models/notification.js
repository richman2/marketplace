import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Notif = sequelize.define("Notification", {
  _notifId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  message: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("unread", "read"),
    defaultValue: "unread",
    allowNull: false,
  },
});
