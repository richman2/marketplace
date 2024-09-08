import ErrorApi from "../../utils/errorApi.js";
import jsonwebtoken from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync.js";
import { User } from "../../models/userModel.js";
export const protect = catchAsync(async (req, res, next) => {
  // check if request contain jwt token
  const authHeaderCheck = req.headers?.authorization?.includes("Bearer");
  if (!authHeaderCheck) return next(new ErrorApi("Unauthorized", 401));
  const [, token] = req.headers.authorization.split(" ");

  const verify = jsonwebtoken.verify(token, "secretKey");
  req.user = await User.findByPk(verify.data.id, { attributes: { includes: ["role"] } });

  const isThereCart = await req.user.getCart();
  req.cart = isThereCart;
  if (!isThereCart) {
    const createdCart = await req.user.createCart();
    req.cart = createdCart;
  }
  next();
});
