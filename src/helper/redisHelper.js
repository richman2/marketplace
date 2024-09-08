import catchAsync from "../utils/catchAsync.js";
import RedisApi from "../utils/RedisApi.js";

export const deleteRedisCache = (Model) => {
  return catchAsync(async (req, res, next) => {
    await RedisApi.deleteByKey({ ModelName: Model.name, uniqueId: req.user.get("_userId") });
    next();
  });
};
