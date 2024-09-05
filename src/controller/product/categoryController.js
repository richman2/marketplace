import { Category } from "../../models/categoryModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import { addMany, addOne, deleteOneRowByKey, updateOneRow } from "../factoryFunction.js";
import RedisApi from "../../utils/RedisApi.js";

const allowFields = ["categoryName", "description", "_parentId"];
export const addOneToCat = addOne(Category, allowFields);
export const addManyToCat = addMany(Category, allowFields);

// export const findAllCat = findAll(Category, `${Category.name}`); // categories string will be a key in redis database
export const findAllChildCategory = catchAsync(async (req, res, next) => {
  const cachedData = await RedisApi.findInRedis({ ModelName: Category.name });
  if (cachedData) return res.status(200).json({ data: cachedData });
  const categories = await Category.findAll({
    where: { _parentId: null },
    include: [
      {
        model: Category,
        as: "children",
        include: [
          {
            model: Category,
            as: "children",
            include: {
              model: Category,
              as: "children",
            },
          },
        ],
      },
    ],
  });
  await RedisApi.setInRedis({ ModelName: Category.name, exTime: 7500, data: categories });
  res.status(200).json({ data: categories });
});
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
