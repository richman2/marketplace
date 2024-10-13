import { Op } from "sequelize";
import { Discount, ProductDiscount } from "../../models/discount.js";
import { Rating } from "../../models/ratingModel.js";
import { sequelize } from "../../models/db.js";
import Query from "../../utils/queryApi.js";
import { Review } from "../../models/reviewModel.js";
import { Category } from "../../models/categoryModel.js";

export const hasDiscount = function (document) {
  let totalsum = 0;
  if (Array.isArray(document)) {
    document.forEach((el) => {
      if (el.dataValues.ProductDiscount?.Discount?.value) {
        const value = el.dataValues.ProductDiscount.Discount.value;
        const type = el.dataValues.ProductDiscount.Discount.discountType;
        el.dataValues.dPrice = calcDiscount(el.get("price"), value, type);
      }
    });
    return document;
  }
  document.dataValues.Products.forEach((el) => {
    const value = el.dataValues.ProductDiscount?.Discount.value;
    const type = el.dataValues.ProductDiscount?.Discount.discountType;
    const price = el.dataValues?.Item.price;
    const quantity = el.dataValues?.Item.quantity;

    if (value && quantity) {
      const divide = price / quantity;
      totalsum += calcDiscount(divide, value, type) * quantity;
    } else {
      totalsum += el.dataValues.Item.price;
    }
  });
  return totalsum;
};

export const calcDiscount = function (price, discountValue, discountType) {
  let discountPrice;
  if (discountValue) {
    // check type of discount (percentage or fixed amount)
    switch (discountType) {
      case "percentage":
        discountPrice = price - (price * discountValue) / 100;
        break;
      case "fixed":
        discountPrice = price - discountValue;
        break;
    }
  }

  return discountPrice;
};

export const widelyUsedIncludeOption = function (search = null) {
  return [
    [
      [ProductDiscount, null, null, ["id"], null],
      [
        Discount,
        null,
        null,
        ["value", "discountType"],
        { isActive: 1, endDate: { [Op.gt]: sequelize.literal("NOW()") } },
      ],
    ],
    [[Rating, null, null, ["rating", "ratingCount"], null]],
    [[Review, null, null, ["comment"], null]],
  ];
};

/*
{
    where: { categoryName: req.params.name },
    include: {
      model: Category,
      as: "children",

      include: {
        model: Category,
        as: "children",

        include: {
          model: Category,
          as: "children",

          include: {
            model: Category,
            as: "children",
          },
        },
      },
    },
  }
    */
