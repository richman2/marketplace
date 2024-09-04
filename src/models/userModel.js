import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import bcrypt from "bcrypt";

export const User = sequelize.define(
  "User",
  {
    _userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "نام نمیتواند خالی باشد",
        },
        notNull: {
          msg: "لطفا نام معتبر وارد کنید",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "نام خانوادگی نمیتواند خالی باشد",
        },
        notNull: {
          msg: "لطفا نام خانوادگی معتبر وارد کنید",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isLowercase: {
          msg: "نام کاربری باید با حروف کوچک باشد",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "لطفا یک ایمیل معتبر وارد کنید",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      Selection: false,
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        isEqual(value) {
          if (value !== this.password) {
            throw new Error("رمز عبور وارد شده یکسان نمیباشد");
          }
        },
      },
      Selection: false,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING(10),
      Selection: false,
      values: ["seller", "admin", "superAdmin", "user"],
      defaultValue: "user",
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "unknown",
    },
  },
  {
    indexes: [{ unique: true, fields: ["_userId"] }],
    tableName: "Users",
    hooks: {
      beforeCreate: async function (record, option) {
        record.password = await bcrypt.hash(record.password, 12);
      },
    },
  }
);
