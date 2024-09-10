import ErrorApi from "../../utils/errorApi.js";
import jsonwebtoken from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync.js";
import { User } from "../../models/userModel.js";
import { promisify } from "node:util";
export const protect = catchAsync(async (req, res, next) => {
  // check if request contain jwt token
  const authHeaderCheck = req.headers?.authorization?.startsWith("Bearer");
  if (!authHeaderCheck) return next(new ErrorApi("Unauthorized", 401));
  const [, token] = req.headers.authorization.split(" ");

  const verify = await promisify(jsonwebtoken.verify)(token, "secretKey");
  if (verify.exp < Date.now() / 1000) return next(new ErrorApi("Token expired"), 401);

  req.user = await User.findByPk(verify.data.id, { attributes: { includes: ["role"] } });
  const checkLogout = req.user.get("logedout");
  if (checkLogout) {
    const logoutTimeStamp = parseInt(Date.parse(checkLogout) / 1000 + 10, 10);
    if (verify.iat < logoutTimeStamp) {
      return next(new ErrorApi("Invalid Token"));
    }
  }

  const checkPassChange = req.user.get("passwordChangedAt");
  if (checkPassChange) {
    const timeStamp = parseInt(Date.parse(checkPassChange) / 1000, 10);
    if (verify.iat < timeStamp) {
      return next(new ErrorApi("Password changed recently, login again"));
    }
  }

  const isThereCart = await req.user?.getCart();
  req.cart = isThereCart;
  if (!isThereCart) {
    const createdCart = await req.user?.createCart();
    req.cart = createdCart;
  }
  const sellerId = await req.user?.getSeller();
  req.userData = { user: req.user, seller: sellerId, cart: req.cart };
  next();
});
