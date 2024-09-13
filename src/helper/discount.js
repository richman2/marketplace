import { Sequelize } from "sequelize";
import { Discount } from "../models/discount.js";
import { DiscountApplied } from "../models/discountApplied.js";
import catchAsync from "../utils/catchAsync.js";
import ErrorApi from "../utils/errorApi.js";

export const createDiscount = catchAsync(async (req, res, next) => {
  await Discount.create({
    name: req.body.name,
    discountType: req.body.discountType,
    value: req.body.value,
    startDate: Date.now(),
    endDate: new Date(req.body.endDate),
    isActive: req.body.isActive,
  });
});

export const createDiscountApply = catchAsync(async (req, res, next) => {
  let id;
  switch (req.params) {
    case "category":
      id = "_categoryId";
      break;
    case "product":
      id = "_productId";
      break;
    case "user":
      id = "_userId";
      break;
  }
  if (!id)
    return next(
      new ErrorApi("تخفیف اعمال نشد لطفا داکیومنت ای پی آی را مطالعه کنید یا از توسعه دهنده راهنمایی بگیرید")
    );
  await DiscountApplied.create({
    [id]: req.body.id,
    minCartValue: req.body.minCartValue,
    maxUses: req.body.maxUses,
    usedCount: 0,
  });
});

export const findingDiscount = async function (totalPrice, id) {
  const findDiscount = await DiscountApplied.findOne({
    where: {
      [id]: id,
      minCartValue: {
        [Sequelize.Op.lte]: totalPrice,
      },
    },
    include: {
      model: Discount,
      where: {
        isActive: true,
        startDate: {
          [Sequelize.Op.lte]: new Date.now(),
        },
        endDate: {
          [Sequelize.Op.gte]: new Date.now(),
        },
      },
    },
  });
  if (!findDiscount) {
    return 0;
  }
  if (findDiscount.maxUses) {
    return 0;
  }
  const discount = findDiscount.Discount;
  let discountAmount = 0;

  if (discount.discountType === "precentage") {
    discountAmount = (totalPrice * discount.value) / 100;
  } else if (discount.discountType == "fixedAmount") {
    discountAmount = discount.value;
  }

  findDiscount.usedCount += 1;
  if (findDiscount.usedCount >= findDiscount.maxUses) {
    findDiscount.maxUses = 0;
  }
  await findDiscount.save();
  return discountAmount;
};
