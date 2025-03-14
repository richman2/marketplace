import { sequelize } from "../models/db.js";
import catchAsync from "../utils/catchAsync.js";
import { redisClient } from "../../main.js";
import filterField from "../utils/filterFields.js";
import ErrorApi from "../utils/errorApi.js";

export const addOne = function (Model, allowFields) {
  return catchAsync(async (req, res, next) => {
    const allowedFields = filterField(allowFields, req.body);
    // await redisClient.del(`${Model.name}`);
    const model = await Model.create(allowedFields);
    res.status(200).json(model);
  });
};

export const addMany = function (Model, allowFields) {
  return catchAsync(async (req, res, next) => {
    
    const allowedFields = filterField(allowFields, req.body);

    const data = await sequelize.transaction(async (t) => {
      await Model.bulkCreate(allowedFields, { transaction: t });
    });
    res.status(200).json({ data: data });
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

export const findByName = function (Model, name, excludeAttr, includeAttr) {
  return catchAsync(async (req, res, next) => {
    const model = await Model.findOne({ where: { [name]: req.params.name } });

    res.status(200).json({ data: model });
  });
};

export const findAll = function (Model) {
  return catchAsync(async (req, res, next) => {
    const model = await Model.findAll();
    if (!model.length) return next(new ErrorApi("پیدا نشد", 404));
    res.status(200).json({
      data: model,
    });
  });
};

export const deleteOneRowByKey = function (Model, columnName) {
  return catchAsync(async (req, res, next) => {
    let doc;
    doc = await Model.findByPk(req.params.id);
    if (!doc) return next(new ErrorApi("پیدا نشد", 404));

    await Model.destroy({ where: { [columnName]: req.params.id } });
    // await redisClient.del(`${Model.name}:${req.params.id}`);
    // await redisClient.del(`${Model.name}`);
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
    // const keys = await redisClient.keys(`${Model.name}`);
    // if (keys.length) await redisClient.del(...keys);
    res.status(200).json({ updatedValue });
  });
};
