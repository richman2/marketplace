import { Review } from "../../models/reviewModel.js";
import { Product } from "../../models/productModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import { sequelize } from "../../models/db.js";
// import { redisClient } from "../../../main.js";
import { rating } from "./ratingController.js";

export const createReview = catchAsync(async (req, res, next) => {
  const { rate, comment, productId } = req.body;
  if (!rate || !comment || !productId) return next(new ErrorApi("خطای دریافت اطلاعات", 400));
  const product = await Product.findByPk(productId);
  if (!product) return next(new ErrorApi("محصول وجود ندارد", 404));
  await rating(productId, rate);
  const createdRev = await Review.create(
    { comment, _productId: productId, _userId: req.user.get("_userId"), status: "pending" },
    { attritutes: ["_reviewId", "_productId", "pending"] }
  );
  req.review = createdRev;
  next();
});

export const getReviewOfOneProducts = catchAsync(async (req, res, next) => {
  const reviews = await Review.findAll({ where: { _productId: req.params.id } });
  if (reviews.length) return next(new ErrorApi("not found", 404));
  res.status(200).json(reviews);
});
export const calcRating = catchAsync(async (req, res, next) => {
  await Product.update(
    {
      totalReviews: sequelize.literal(`totalReviews + 1`),
    },
    { where: { _productId: req.review.get("_productId") } }
  );
  // const keys = await redisClient.keys("Product:*");
  // await redisClient.del(keys);
  res.send("ok");
});
