import { sequelize } from "../models/db.js";
import catchAsync from "../utils/catchAsync.js";
import { redisClient } from "../../main.js";

function filterField(fields, requestFields) {
  let allowedFields = {};
  let listOfAllowedFeilds = [];

  if (Array.isArray(requestFields)) {
    for (let f of requestFields) {
      for (let i of fields) {
        if (i in f) {
          allowedFields[i] = f[i];
        }
      }
      listOfAllowedFeilds.push(allowedFields);
      allowedFields = {};
    }
    return listOfAllowedFeilds;
  }
  for (let f of fields) {
    if (f in requestFields) {
      allowedFields[f] = requestFields[f];
    }
  }
  return allowedFields;
}

export const addOne = function (Model, allowFields) {
  return catchAsync(async (req, res, next) => {
    const allowedFields = filterField(allowFields, req.body);
    const category = await Model.create(allowedFields);
    res.status(200).json(category);
  });
};

export const addMany = function (Model, allowFields) {
  return catchAsync(async (req, res, next) => {
    const allowedFields = filterField(allowFields, req.body);

    const categories = await sequelize.transaction(async (t) => {
      await Model.bulkCreate(allowedFields, { transaction: t });
    });
    res.status(200).json(categories);
  });
};

export const findById = function (Model) {
  return catchAsync(async (req, res, next) => {
    const model = Model.findOne();
  });
};

export const findAll = function (Model, table) {
  return catchAsync(async (req, res, next) => {
    const cached = await redisClient.get(table);
    if (cached) return res.status(200).json({ data: JSON.parse(cached) });
    const model = await Model.findAll();
    await redisClient.set(table, JSON.stringify(model), "Ex", 3600);
    res.status(200).json({
      data: model,
    });
  });
};
