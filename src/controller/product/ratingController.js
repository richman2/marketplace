import catchAsync from "../../utils/catchAsync.js";
import { Rating } from "../../models/ratingModel.js";
import { sequelize } from "../../models/db.js";

export const rating = async (productId, rating) => {
  const rate = await Rating.findOne({ where: { _productId: productId } });
  console.log(rate)
  if (!rate) {
    await Rating.create({
      _productId: productId,
      rating,
      ratingCount: sequelize.literal("ratingCount + 1"),
      ratingSum: rating,
    });
  } else {
    rate.rating = (rate.ratingSum + rating) / (rate.ratingCount + 1);
    rate.ratingCount += 1;
    rate.ratingSum += rating;
    await rate.save();
  }
};
