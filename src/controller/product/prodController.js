import { Product } from "../../models/productModel.js";
import catchAsync from "../../utils/catchAsync.js";
import { deleteOneRowByKey } from "../factoryFunction.js";
import filterField from "../../utils/filterFields.js";
import { Category } from "../../models/categoryModel.js";
import ErrorApi from "../../utils/errorApi.js";
import { redisClient } from "../../../main.js";
import { Seller } from "../../models/sellerModel.js";
import RedisApi from "../../utils/RedisApi.js";

const allowFields = ["productName", "description", "price", "stockQuantity", "imagePath", "status"];

export const addOneProd = catchAsync(async (req, res, next) => {
  const category = await Category.findByPk(req.params.id);
  // const [seller] = await Seller.findAll({ where: { _userId: req.user.id } });
  if (!category) return next(new ErrorApi("چنین دسته بندی وجود ندارد", 404));
  // if (!seller) return next(new ErrorApi("ابتدا به عنوان فروشنده ثبت نام کنید", 403));

  const categoryId = category.dataValues._categoryId;
  // const sellerId = seller.dataValues._sellerId;

  const allowedFields = filterField(allowFields, req.body);
  allowedFields._categoryId = parseInt(req.params.id);
  allowFields._sellerId = 1; //sellerId;

  const product = await Product.create(allowedFields);
  const redisDataCheck = await RedisApi.findInRedis(Product.name, categoryId);
  if (redisDataCheck) {
    redisDataCheck.push(product);
    await RedisApi.setInRedis(Product.name, categoryId, redisDataCheck, 3600);
  } else {
    await RedisApi.setInRedis(Product.name, categoryId, [product], 3600);
  }
  res.status(201).json({
    status: "Created",
  });
});

export const findProds = catchAsync(async (req, res, next) => {
  const redisData = JSON.parse(await redisClient.get(`${Product.name}:${req.params.id}`));

  if (redisData) return res.status(200).json({ data: redisData, total: redisData.length });

  const [categoryId] = await Category.findAll({ where: { _categoryId: req.params.id } });
  if (!categoryId) return next(new ErrorApi("چنین دسته بندی وجود ندارد", 404));

  const products = await Product.findAll({ where: { _categoryId: categoryId.dataValues._categoryId } });
  if (!products.length) return next(new ErrorApi("چنین محصولی وجد ندارد", 404));

  await redisClient.set(`${Product.name}:${req.params.id}`, JSON.stringify(products), "EX", 3600);
  res.status(200).json({ data: products, totoal: products.length });
});

export const deleteOneProd = deleteOneRowByKey(Product, "_productId");
