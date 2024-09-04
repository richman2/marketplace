import { sequelize } from "../models/db.js";
import catchAsync from "../utils/catchAsync.js";
import { redisClient } from "../../main.js";
import filterField from "../utils/filterFields.js";
import ErrorApi from "../utils/errorApi.js";

export const addOne = function (Model, allowFields) {
  return catchAsync(async (req, res, next) => {
    const allowedFields = filterField(allowFields, req.body);
    const model = await Model.create(allowedFields);
    res.status(200).json(model);
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

export const findById = function (Model, excludeAttr, includeAttr) {
  return catchAsync(async (req, res, next) => {
    const model = await Model.findByPk(req.params.id, { attributes: { exclude: excludeAttr, include: includeAttr } });
    res.status(200).json({
      data: model,
    });
  });
};

export const findAll = function (Model, table) {
  return catchAsync(async (req, res, next) => {
    const cached = await redisClient.get(table);
    if (cached) return res.status(200).json({ data: JSON.parse(cached) });
    const model = await Model.findAll();
    if (!model.length) return next(new ErrorApi("پیدا نشد", 404));
    await redisClient.set(table, JSON.stringify(model), "Ex", 3600);
    res.status(200).json({
      data: model,
    });
  });
};

export const deleteOneRowByKey = function (Model, columnName) {
  return catchAsync(async (req, res, next) => {
    const isExist = await Model.findByPk(req.params.id);
    if (!isExist) return next(new ErrorApi("پیدا نشد", 404));
    await Model.destroy({ where: { [columnName]: req.params.id } });
    await redisClient.del(`${Model.name}:${req.params.id}`);
    await redisClient.del(`${Model.name}`);
    res.status(204).send("deleted");
  });
};

export const updateOneRow = function (Model, allowFields) {
  return catchAsync(async (req, res, next) => {
    const isExist = await Model.findByPk(req.params.id);

    if (!isExist) return next(new ErrorApi("پیدا نشد", 404));
    const id = Object.keys(isExist.dataValues)[0];

    const allowedFields = filterField(allowFields, req.body);
    const updatedValue = await Model.update(allowedFields, { where: { [id]: req.params.id } });
    await redisClient.del(`${Model.name}:${req.params.id}`);
    await redisClient.del(`${Model.name}`);
    res.status(200).json({ updatedValue });
  });
};
