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

  if (!req.user) return next(new ErrorApi("Unauthorize", 401));

  const checkLogout = req.user?.get("logedout");
  if (checkLogout) {
    const logoutTimeStamp = parseInt(Date.parse(checkLogout) / 1000 + 10, 10);
    if (verify.iat < logoutTimeStamp) {
      return next(new ErrorApi("Invalid Token", 401));
    }
  }

  const checkPassChange = req.user?.get("passwordChangedAt");
  if (checkPassChange) {
    const timeStamp = parseInt(Date.parse(checkPassChange) / 1000, 10);
    if (verify.iat < timeStamp) {
      return next(new ErrorApi("Password changed recently, login again"));
    }
  }
  next();
});

export const checkCart = catchAsync(async (req, res, next) => {
  const isThereCart = await req.user?.getCart();
  req.cart = isThereCart;
  if (!isThereCart) {
    const createdCart = await req.user?.createCart();
    req.cart = createdCart;
  }

  next();
});

export const checkSeller = catchAsync(async (req, res, next) => {
  const seller = await req.user?.getSeller();
  if (!seller) return next(new ErrorApi("Forbidden", 404));
  req.user.seller = seller;

  next();
});
