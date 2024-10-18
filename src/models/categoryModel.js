import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Product } from "./productModel.js";

export const Category = sequelize.define(
  "Category",
  {
    _categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    _parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "_categoryId",
      },
    },
  },
  {
    paranoid: true,
    indexes: [{ unique: true, fields: ["categoryName"] }],
    hooks: {
      beforeBulkCreate: async (records) => {
        const category = await Category.findByPk(records[0].get("_parentId"));
        records.forEach((el) => {
          el.dataValues.path = el.get("_parentId")
            ? `${category.get("path")}/${el.get("_parentId")}`
            : `/${el.dataValues.categoryName}`;
        });
      },
    },
  }
);
