import { Product } from "../../models/productModel.js";
import catchAsync from "../../utils/catchAsync.js";
import { deleteOneRowByKey, findByName } from "../factoryFunction.js";
import filterField from "../../utils/filterFields.js";
import { Category } from "../../models/categoryModel.js";
import ErrorApi from "../../utils/errorApi.js";
import { redisClient } from "../../../main.js";

const allowFields = ["productName", "description", "price", "stockQuantity", "imagePath", "status"];

export const addOneProd = catchAsync(async (req, res, next) => {
  const is_seller = req.user.get("role") === "seller";
  if (!is_seller) return next(new ErrorApi("ابتدا به عنوان فروشنده ثبت نام کنید", 403));

  const category = await Category.findOne({ where: { categoryName: req.params.name } });

  if (!category) return next(new ErrorApi("چنین دسته بندی وجود ندارد", 404));

  const allowedFields = filterField(allowFields, req.body);
  allowFields._sellerId = req.user.get("_userId");
  const createdProduct = await category.createProduct(allowedFields);
  req.data = createdProduct;
  next();
});

export const findProds = catchAsync(async (req, res, next) => {
  const redisData = JSON.parse(await redisClient.get(`${Product.name}:${req.params.name}`));

  if (redisData) return res.status(200).json({ data: redisData, total: redisData.length });

  const category = await Category.findOne({
    where: { categoryName: req.params.name },
    include: ["children"],
  });
  if (!category) return next(new ErrorApi("چنین دسته بندی وجود ندارد", 404));

  if (category.get("children").length) {
    const products = await Promise.all(
      category.get("children").map(async (e) => await Product.findAll({ where: { _categoryId: e._categoryId } }))
    );
    console.log(products.filter((e) => e.length));
    return res.status(200).json({ data: products });
  }
  const products = await Product.findAll({ where: { _categoryId: category.get("_categoryId") } });
  if (!products.length) return next(new ErrorApi("چنین محصولی وجود ندارد", 404));

  await redisClient.set(`${Product.name}:${req.params.name}`, JSON.stringify(products), "EX", 3600);
  res.status(200).json({ data: products, totoal: products.length });
});

export const deleteOneProd = deleteOneRowByKey(Product, "_productId");
export const findOneProd = findByName(Product, "productName");
