import { Op, Sequelize } from "sequelize";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import validator from "validator";
import crypto from "node:crypto";
import mailSender from "../../utils/mailSender.js";

const signToken = (data) => {
  return jsonwebtoken.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken({ data: { id: user.get("_userId"), username: user.get("username") } });

  user.password = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  user.passwordChangedAt = undefined;
  user.role = undefined;
  user.logedout = undefined;

  res.status(statusCode).json({
    status: "success",
    data: user,
    token,
  });
};
export const signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, username, password, passwordConfirm, email } = req.body;
  console.log(req.session);
  const user = await User.create({ firstName, lastName, username, email, password, passwordConfirm });
  createSendToken(user, 201, res);
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
  const compare = await bcrypt.compare(password, user.get("password"));
  console.log(compare);
  if (!compare) return next(new ErrorApi("رمز عبور اشتباه میباشد"), 400);
  user.dataValues.password = undefined;

  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, passwordConfirm, password } = req.body;
  if (!passwordConfirm || !passwordCurrent || !password) return next(new ErrorApi("پر کردن فیلد ها الزامی هست"));
  const user = await User.findByPk(req.user.get("_userId"), { attributes: { include: ["password"] } });
  const compare = await bcrypt.compare(req.body.passwordCurrent, user.get("password"));
  if (!compare) return next(new ErrorApi("Your current password is wrong", 401));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();
  createSendToken(user, 200, res);
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new ErrorApi("ایمیل خود را وارد کنید", 400));
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new ErrorApi("چنین کاربری وجود ندارد", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log(resetToken);
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpire = Date.now() + 600000;
  await user.save();
  const url = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;
  try {
    await new mailSender(req.body.email, "Reset password", url).send();
    res.status(200).json({
      status: "sucess",
      message: "We sent reset password link to your email. Chack your box mail",
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpire = null;
    await user.save();
    console.log(err);
    return next(new ErrorApi("مشکلی در ارسال ایمیل به وجود آمده لطفا مجدد تلاش کنید", 500));
  }
});

export const resetPasswordToken = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  console.log(hashedToken);
  const user = await User.findOne({
    where: { passwordResetToken: hashedToken, passwordResetExpire: { [Op.gt]: Date.now() } },
  });
  if (!user) return next(new ErrorApi("توکن معتبر نمیباشد"));

  const { passwordConfirm, password } = req.body;
  if (!passwordConfirm || !password) return next(new ErrorApi("پر کردن فیلد ها الزامی هست"));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetExpire = null;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();
  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.get("_userId"));
  user.logedout = Date.now();
  await user.save();
  res.status(200).send("ok");
});
