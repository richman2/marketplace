import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';
import bcrypt from 'bcrypt';

export const User = sequelize.define(
  'User',
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isLowercase: true,
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
            throw new Error('رمز عبور وارد شده یکسان نمیباشد');
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
      defaultValue: 'user',
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'unknown',
    },
  },
  {
    tableName: 'Users',
    hooks: {
      beforeCreate: async function (record, option) {
        record.password = await bcrypt.hash(record.password, 12);
      },
    },
  }
);

