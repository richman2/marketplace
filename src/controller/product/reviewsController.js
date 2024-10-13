import { Review } from "../../models/reviewModel.js";
import { Product } from "../../models/productModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import { sequelize } from "../../models/db.js";
import { redisClient } from "../../../main.js";

export const createReview = catchAsync(async (req, res, next) => {
  const { rate, comment, productId } = req.body;
  if (!rate || !comment || !productId) return next(new ErrorApi("خطای دریافت اطلاعات", 400));
  const product = await Product.findByPk(productId);
  if (!product) return next(new ErrorApi("محصول وجود ندارد", 404));
  await (productId, rate);
  const createdRev = await Review.create(
    { comment, _productId: productId, _userId: req.user.get("_userId"), status: "pending" },
    { attritutes: ["_reviewId", "_productId", "pending"] }
  );
  req.review = createdRev;
  next();
});

export const calcRating = catchAsync(async (req, res, next) => {
  await Product.update(
    {
      totalReviews: sequelize.literal(`totalReviews + 1`),
    },
    { where: { _productId: req.review.get("_productId") } }
  );
  const keys = 
  await redisClient.del(`Product:*`)
  res.send("ok");
});
