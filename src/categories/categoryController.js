import { Category } from "../models/categoryModel.js";
import catchAsync from "../utils/catchAsync.js";
import ErrorApi from "../utils/errorApi.js";
import { addMany, addOne, deleteOneRowByKey, updateOneRow } from "../controller/factoryFunction.js";
import Query from "../utils/queryApi.js";

const allowFields = ["categoryName", "description", "_parentId"];
export const addOneToCat = addOne(Category, allowFields);
export const addManyToCat = addMany(Category, allowFields);
export const addOneCategory = catchAsync(async (req, res, next) => {
  let parentPath = "/";
  const { _parentId, categoryName } = req.body;

  if (_parentId) {
    const parentCategory = await Category.findByPk(_parentId);
    if (!parentCategory) return next(new ErrorApi("چنین دسته بندی وجود ندارد", 404));

    parentPath = parentCategory.path;
  }
  await Category.create({
    categoryName: categoryName,
    path: _parentId ? `${parentPath}/${_parentId}` : `/${categoryName}`,
    _parentId,
  });
  res.sendStatus(201);
});
export const findAllChildCategory = catchAsync(async (req, res, next) => {
  // const cachedData = await RedisApi.findInRedis({ ModelName: Category.name });
  // if (cachedData) return res.status(200).json({ data: cachedData });
  let query = new Query().filter({ _parentId: null });
  query = query.includeOption(
    1,
    [4],
    [
      [
        [Category, null, "children", null, null],
        [Category, null, "children", null, null],
        [Category, null, "children", null, null],
        [Category, null, "children", null, null],
      ],
    ]
  );
  const categories = await Category.findAll(query.option);

  // await RedisApi.setInRedis({ ModelName: Category.name, exTime: 7500, data: categories });
  res.status(200).json({ data: categories });
});

export const findOneCat = catchAsync(async (req, res, next) => {
  // if (categoryName) return res.status(200).json({ data: categoryName });

  const getCategoryName = await Category.findAll({ where: { _categoryId: req.params.id } });
  if (!getCategoryName.length) return next(new ErrorApi("چنین دسته بندی وجود ندارد.", 404));

  res.status(200).json({ data: getCategoryName });
});
export const deleteOneCat = deleteOneRowByKey(Category, "_categoryId");
export const updateOneCat = updateOneRow(Category, allowFields);
