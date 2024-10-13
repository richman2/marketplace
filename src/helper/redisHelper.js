import { redisClient } from "../../main.js";
import { Category } from "../models/categoryModel.js";
import catchAsync from "../utils/catchAsync.js";

export const deleteRedisCache = (Model) => {
  return catchAsync(async (req, res, next) => {
    switch (Model.name) {
      case "Cart":
        await redisClient.del(`${Model.name}${req.user.get("_userId")}`);
        break;
      case "Product":
        const key = await redisClient.keys(`${Model.name}:*`);
        if (key.length) await redisClient.del(...key);
        break;
    }
    next();
  });
};
