import { Category } from "../models/categoryModel.js";
import catchAsync from "../utils/catchAsync.js";
import RedisApi from "../utils/RedisApi.js";

export const deleteRedisCache = (Model) => {
  return catchAsync(async (req, res, next) => {
    switch (Model.name) {
      case "Cart":
        await RedisApi.deleteByKey({ ModelName: Model.name, uniqueId: req.user.get("_userId") });
        break;
      case "Product":
        await RedisApi.deleteByKey({ ModelName: Model.name, uniqueId: req.params.name });
        if (req.catId) {
          const category = await Category.findByPk(req.catId);
          await RedisApi.deleteByKey({ ModelName: Model.name, uniqueId: category.get("categoryName") });
          return res.send("ok");
        }
        break;
    }
    next();
  });
};
export const findRedisCache = (Model) => {
  return catchAsync(async (req, res, next) => {
    let cachedData;
    switch (Model.name) {
      case "Cart":
        cachedData = await RedisApi.findInRedis({ ModelName: Model.name, uniqueId: req.user.get("_userId") });
        break;
      case "Product":
        cachedData = await RedisApi.findInRedis({ ModelName: Model.name, uniqueId: req.params.name });
        break;
    }
    req.data = cachedData;
    next();
  });
};

export const setRedisCache = (Model) => {
  return catchAsync(async (req, res, next) => {
    switch (Model.name) {
      case "Cart":
        await RedisApi.setInRedis({
          ModelName: Model.name,
          uniqueId: req.user.get("_userId"),
          data: req.data,
          exTime: 3600,
        });
        break;
      case "Product":
        const redisDataCheck = await RedisApi.findInRedis({ ModelName: Model.name, uniqueId: req.params.name });
        if (redisDataCheck) {
          redisDataCheck.push(req.data);
          await RedisApi.setInRedis({
            ModelName: Model.name,
            uniqueId: req.params.name,
            data: redisDataCheck,
            exTime: 3600,
          });
        } else {
          await RedisApi.setInRedis({
            ModelName: Model.name,
            uniqueId: req.params.name,
            data: [req.data],
            exTime: 3600,
          });
        }
    }
    res.status(200).json(req.data);
  });
};
