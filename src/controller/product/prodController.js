import { Product } from "../../models/productModel.js";
import catchAsync from "../../utils/catchAsync.js";
import { deleteOneRowByKey, updateOneRow } from "../factoryFunction.js";
import filterField from "../../utils/filterFields.js";
import { Category } from "../../models/categoryModel.js";
import ErrorApi from "../../utils/errorApi.js";
import { Op } from "sequelize";
import { hasDiscount, widelyUsedIncludeOption } from "./helper.js";
import Query from "../../utils/queryApi.js";
import { redisClient } from "../../../main.js";
import { Discount, ProductDiscount } from "../../models/discount.js";

const allowFields = ["productName", "description", "price", "stockQuantity", "status"];

export const addOneProd = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    where: { categoryName: req.body.categoryName },
    include: [{ model: Category, as: "children" }],
  });
  if (category.get("children").length) return next(new ErrorApi("این یک دسته بندی کلی هست", 400));

  if (!category) return next(new ErrorApi("دسته بندی محصول نامعتبر یا وارد نشده است", 404));
  const redisKey = `${Product.name}:${category.get("path").split("/")[1]}`;

  const allowedFields = filterField(allowFields, req.body);
  allowedFields._sellerId = req.user.seller.get("_sellerId");

  const createdProduct = await category.createProduct(allowedFields);

  const data = await redisClient.get(redisKey);
  if (data) {
    await redisClient.del(redisKey);
    const updatedData = JSON.parse(data).concat(createdProduct);
    await redisClient.set(redisKey, JSON.stringify(updatedData), "EX", 3600);
  } else {
    await redisClient.set(redisKey, JSON.stringify(createdProduct), "EX", 3600);
  }
  res.status(201).json();
});

export const findProds = catchAsync(async (req, res, next) => {
  let { offset, sort, page, limit, order } = req.query;

  const category = await Category.findOne({ where: { categoryName: req.params.name } });

  if (!category) return next(new ErrorApi("چنین دسته بندی وجود ندارد", 404));
  const redisKey = `${Product.name}:${category.get("path").split("/")[1]}`;

  const redisData = await redisClient.get(redisKey);
  if (redisData) {
    return res.status(200).json({ data: JSON.parse(redisData), total: JSON.parse(redisData).length });
  }

  const cat = await Category.findAll({
    where: { path: { [Op.like]: `${category.get("path")}%` } },
  });
  const catIds = cat.map((el) => el.get("_categoryId"));

  let query = new Query();
  query = query.filter({ _categoryId: { [Op.in]: catIds } }).includeOption(2, [2, 1], widelyUsedIncludeOption());

  switch (sort) {
    case "1":
      query = query.sort("createdAt", order);
      break;
    case "2":
      query = query.sort("saleCount", order);
      break;
    case "3":
      query = query.sort("price", "ASC");
      break;
    case "4":
      query = query.sort("price", "DESC");
      break;
  }
  query.option.attributes = ["_productId", "productName", "price", "imagePath", "_categoryId"];
  const products = await Product.findAll(query.option);

  if (!products.length || !products[0].get("_productId")) return next(new ErrorApi("چنین محصولی وجود ندارد", 404));

  hasDiscount(products);
  await redisClient.set(redisKey, JSON.stringify(products), "EX", 3600);
  res.status(200).json({ data: products /*cat*/, totoal: products.length });
});

export const deleteOneProd = deleteOneRowByKey(Product, "_productId");
export const updateOnePro = updateOneRow(Product, allowFields);
export const findOneProd = catchAsync(async (req, res, next) => {
  const query = new Query()
    .filter({ _productId: req.params.id })
    .includeOption(3, [2, 1, 1], widelyUsedIncludeOption());
  const product = await Product.findOne(query.option);
  if (product) return next(new ErrorApi("پیدا نشد", 404));
  res.status(200).json(product);
});

export const findMyProduct = catchAsync(async (req, res, next) => {
  const myProducts = await req.user.seller.getProducts({
    include: { model: ProductDiscount, include: { model: Discount } },
  });
  hasDiscount(myProducts);
  if (!myProducts.length) return next(new ErrorApi("Not Found", 404));
  res.status(200).json({ data: myProducts });
});
// export const updateOneProduct = updateO;

export const search = catchAsync(async (req, res, next) => {
  const { offset, filters, page, limit, order } = req.query;

  let query = new Query();

  query = query.includeOption(2, [2, 1], widelyUsedIncludeOption());

  if (filters === "mostSeller") {
    query = query.filter({ [Op.iLike]: `%${req.query.s}%` }, "productName").sort("saleCount", order);
  }
  if (page && limit && offset) {
    query = query.pagination(limit, offset, page);
  } else {
    query = query.filter({ productName: { [Op.like]: `%${req.query.s}%` } });
  }
  query.option.attributes = ["_productId", "productName", "price", "imagePath", "_categoryId"];

  const products = await Product.findAll(query.option);
  hasDiscount(products);

  res.status(200).json(products);
});
