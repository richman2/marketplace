import { Op } from "sequelize";
import { sequelize } from "../../models/db.js";
import { Discount } from "../../models/discount.js";
import { ProductDiscount } from "../../models/discount.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import filterField from "../../utils/filterFields.js";
import { updateOneRow } from "../factoryFunction.js";

export const addDiscount = catchAsync(async (req, res, next) => {
  // check discount limit service, anyone can only create 5 discount service
  const limitUSage = await req.user.seller.getDiscounts();

  if (limitUSage.length > 5) return next(new ErrorApi("بیشتر از 5 بار نمیتوانید از سرویس تخفیف استفاده کنید", 403));

  const { discountName, discountType, value, endDate, isActive } = req.body;

  await req.user.seller.createDiscount({
    discountName,
    discountType,
    value,
    endDate,
    isActive,
  });
  res.status(201).json();
});

export const applyProductDiscount = catchAsync(async (req, res, next) => {
  // check if product contain discount or not
  const checkProdDisc = await ProductDiscount.findOne({ where: { _productId: req.body.productId } });

  if (checkProdDisc) return next(new ErrorApi("روی این محصول قبلا تخفیف اعمال شده.", 422));

  // check if Discount is there
  const discount = await Discount.findOne({
    where: {
      _sellerId: req.user.seller.get("_sellerId"),
      discountName: req.body.discountName,
      isActive: 1,
      endDate: { [Op.gt]: sequelize.literal("NOW()") },
      startDate: { [Op.lte]: sequelize.literal("NOW()") },
    },
  });
  if (!discount) return next(new ErrorApi("سرویس تخفیف وجود ندارد", 404));

  // if query parameter is equal to true, apply discount on all products of the seller
  if (req.query.bulk === "true") {
    // get all of products of the seller
    const products = await req.user.seller.getProducts();

    // save data into ProductDiscount table
    const createQuery = products.map(async (el) => {
      return await ProductDiscount.create({ _productId: el.get("_productId"), _discountId: req.body.discountId });
    });
    // excute queries
    await Promise.all(createQuery);
    return res.status(204).json({});
  }

  const { productId } = req.body;
  // check existing product
  const checkProduct = await req.user.seller.getProducts({ where: { _productId: productId } });
  if (!checkProduct.length) return next(new ErrorApi("چنین محصولی وجود ندارد", 404));

  await ProductDiscount.findOrCreate({
    where: { _productId: req.body.productId },
    defaults: { _productId: productId, _discountId: discount.get("_discountId") },
  });
  res.status(201).json({});
});

export const deleteDiscount = catchAsync(async (req, res, next) => {
  await Discount.destroy({ where: { _discountId: req.body.discountId } });

  await ProductDiscount.destroy({ where: { _discountId: req.body.discount } });

  res.status(204).json();
});

export const updateDiscount = updateOneRow(Discount, ["discountName", "isActive", "endDate", "discountType", "value"]);

export const getMyDiscount = catchAsync(async (req, res, next) => {
  const discount = await Discount.findAll({ where: { _sellerId: req.user.seller.get("_sellerId") } });
  if (!discount.length) return next(new ErrorApi("سرویس تخفیفی ندارید", 404));
  res.status(200).json(discount);
});
