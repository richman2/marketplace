import { Category } from "../../models/categoryModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import { addMany, addOne, findAll } from "../factoryFunction.js";
import { redisClient } from "../../../main.js";

const allowFields = ["categoryName", "description"];
export const addOneTOCat = addOne(Category, allowFields);
export const addManyToCat = addMany(Category, allowFields);

export const findAllCat = findAll(Category, "categories"); // categories string will be a key in redis database
// catchAsync(async (req, res, next) => {
//     const { categoryName, description } = req.body;
//     if (!categoryName || !description)
//       return next(new ErrorApi("لطفا نام و توضیحات مربوط به دسته بندی را وارد کنید"), 400);

//     const category = await Category.create({
//       categoryName,
//       description,
//     });
//     res.status(200).json({
//       data: category,
//     });
//   });
