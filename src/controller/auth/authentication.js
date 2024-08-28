import { Sequelize } from "sequelize";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import validator from "validator";
export const signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, username, password, passwordConfirm, email } = req.body;
  await User.create({ firstName, lastName, username, email, password, passwordConfirm });
  res.status(200).json({
    status: "success",
  });
});

export const login = catchAsync(async (req, res, next) => {
  // check if the user exist
  const { email, username, password } = req.body;

  // check if email or username and password have value
  const usernameOrEmail = email ?? username;
  if (!usernameOrEmail || !password) return next(new ErrorApi("لطفا ایمیل یا نام کاربری و پسورد خودت را وارد کنید"));

  if (email && !validator.isEmail(email)) {
    return next(new ErrorApi("یک ایمل معتبر وارد کنید", 400));
  }
  const [user] = await User.findAll({
    where: Sequelize.or({ username: username ?? "" }, { email: email ?? "" }),
  });

  if (!user) return next(new ErrorApi("چنین مشخصاتی در سیستم وجود ندارد. لطفا ثبت نام کنید و بعد وارد شوید"), 400);
  // check if password is correct
  const compare = await bcrypt.compare(password, user.dataValues.password);
  if (!compare) return next(new ErrorApi("رمز عبور اشتباه میباشد"), 400);
  user.dataValues.password = undefined;

  // create jwt token
  const token = jsonwebtoken.sign(
    { data: { id: user.dataValues.userId, username: user.dataValues.username } },
    "secretKey",
    {
      expiresIn: "1m",
    }
  );
  res.status(200).json({
    data: user,
    token,
  });
});

export const protect = catchAsync(async (req, res, next) => {
  // check if request contain jwt token
  const authHeaderCheck = req.headers?.authorization?.includes("Bearer");
  if (!authHeaderCheck) return next(new ErrorApi("Unauthorized", 401));
  const [, token] = req.headers.authorization.split(" ");
  
  const verify = jsonwebtoken.verify(token, "secretKey");

  req.user = verify.data;
  next();
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findAll({
    where: { userId: req.user.id },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });

  res.status(200).json({
    data: user,
  });
});
