import { Category } from "../../models/categoryModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import { addMany, addOne, deleteOneRowByKey, findAll, updateOneRow } from "../factoryFunction.js";
import { redisClient } from "../../../main.js";
import RedisApi from "../../utils/RedisApi.js";

const allowFields = ["categoryName", "description"];
export const addOneTOCat = addOne(Category, allowFields);
export const addManyToCat = addMany(Category, allowFields);

export const findAllCat = findAll(Category, `${Category.name}`); // categories string will be a key in redis database
export const findOneCat = catchAsync(async (req, res, next) => {
  const categoryName = await RedisApi.findInRedis({ ModelName: Category.name, uniqueId: req.params.id });

  if (categoryName) return res.status(200).json({ data: categoryName });

  const getCategoryName = await Category.findAll({ where: { _categoryId: req.params.id } });
  if (!getCategoryName.length) return next(new ErrorApi("چنین دسته بندی وجود ندارد.", 404));

  await RedisApi.setInRedis({
    ModelName: Category.name,
    uniqueId: req.params.id,
    data: getCategoryName,
    exTime: 14400,
  });
  res.status(200).json({ data: getCategoryName });
});
export const deleteOneCat = deleteOneRowByKey(Category, "_categoryId");
export const updateOneCat = updateOneRow(Category, allowFields);
