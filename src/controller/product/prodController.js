import { Product } from "../../models/productModel.js";
import catchAsync from "../../utils/catchAsync.js";
import { deleteOneRowByKey } from "../factoryFunction.js";
import filterField from "../../utils/filterFields.js";
import { Category } from "../../models/categoryModel.js";
import ErrorApi from "../../utils/errorApi.js";
import { redisClient } from "../../../main.js";
import RedisApi from "../../utils/RedisApi.js";
import { Authorization } from "../../helper/caslAuth.js";
import { User } from "../../models/userModel.js";

const allowFields = ["productName", "description", "price", "stockQuantity", "imagePath", "status"];

export const addOneProd = catchAsync(async (req, res, next) => {
  const is_seller = await new Authorization().isSeller(User, req.user.get("_userId"));
  if (!is_seller) return next(new ErrorApi("ابتدا به عنوان فروشنده ثبت نام کنید", 403));

  const category = await Category.findByPk(req.params.id);

  if (!category) return next(new ErrorApi("چنین دسته بندی وجود ندارد", 404));

  const categoryId = category.get("_categoryId");

  const allowedFields = filterField(allowFields, req.body);
  allowFields._sellerId = req.user.get("_userId");

  const createdProduct = await category.createProduct(allowedFields);
  const redisDataCheck = await RedisApi.findInRedis(Product.name, categoryId);
  if (redisDataCheck) {
    redisDataCheck.push(createdProduct);
    await RedisApi.setInRedis({ ModelName: Product.name, uniqueId: categoryId, data: redisDataCheck, exTime: 3600 });
  } else {
    await RedisApi.setInRedis({ ModelName: Product.name, uniqueId: categoryId, data: [createdProduct], exTime: 3600 });
  }
  res.status(201).json({
    status: 200,
    data: { createdProduct },
  });
});

export const findProds = catchAsync(async (req, res, next) => {
  const redisData = JSON.parse(await redisClient.get(`${Product.name}:${req.params.id}`));

  if (redisData) return res.status(200).json({ data: redisData, total: redisData.length });

  const [categoryId] = await Category.findAll({ where: { _categoryId: req.params.id } });
  if (!categoryId) return next(new ErrorApi("چنین دسته بندی وجود ندارد", 404));

  const products = await Product.findAll({ where: { _categoryId: categoryId.get("_categoryId") } });
  if (!products.length) return next(new ErrorApi("چنین محصولی وجود ندارد", 404));

  await redisClient.set(`${Product.name}:${req.params.id}`, JSON.stringify(products), "EX", 3600);
  res.status(200).json({ data: products, totoal: products.length });
});

export const deleteOneProd = deleteOneRowByKey(Product, "_productId");
