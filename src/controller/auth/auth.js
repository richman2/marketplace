import { Op, Sequelize } from "sequelize";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import validator from "validator";
import crypto from "node:crypto";
import mailSender from "../../helper/mailSender.js";

const signToken = (data) => {
  return jsonwebtoken.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, action) => {
  let token;
  if (action !== "signup") {
    token = signToken({ data: { id: user.get("_userId"), username: user.get("username") } });
  }
  user.password = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  user.passwordChangedAt = undefined;
  user.passwordConfirm = undefined;
  user.role = undefined;
  user.logedout = undefined;

  res.status(statusCode).json({
    status: "success",
    data: user,
    token,
  });
};
export const signUp = catchAsync(async (req, res, next) => {
  // get info from body
  const { firstName, lastName, username, password, passwordConfirm, email } = req.body;

  const user = await User.create({ firstName, lastName, username, email, password, passwordConfirm });

  createSendToken(user, 201, res, "signup");
});

export const login = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;

  // check if email or username and password have value
  const usernameOrEmail = email ?? username;
  if (!usernameOrEmail || !password)
    return next(new ErrorApi("لطفا ایمیل یا نام کاربری و پسورد خودت را وارد کنید", 400));

  if (email && !validator.isEmail(email)) {
    return next(new ErrorApi("یک ایمیل معتبر وارد کنید", 422));
  }
  const user = await User.findOne({
    where: Sequelize.or({ username: username ?? "" }, { email: email ?? "" }),
  });

  // check if the user exist
  if (!user) return next(new ErrorApi("چنین مشخصاتی در سیستم وجود ندارد. لطفا ثبت نام کنید و بعد وارد شوید"), 400);

  // check if password is correct
  const compare = password === user.get("password"); //bcrypt.compare(password, user.get("password"));
  if (!compare) return next(new ErrorApi("رمز عبور اشتباه میباشد", 401));
  user.dataValues.password = undefined;

  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPasswordConfirm, newPassword } = req.body;

  if (!newPasswordConfirm || !currentPassword || !newPassword)
    return next(new ErrorApi("پر کردن فیلد ها الزامی هست", 400));

  const user = await User.findByPk(req.user.get("_userId"), { attributes: { include: ["password"] } });

  // copare passwords
  const compare = bcrypt.compare(req.body.currentPassword, user.get("password"));
  if (!compare) return next(new ErrorApi("Your current password is wrong", 401));

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  user.passwordChangedAt = Date.now() - 1000;
  await user.save();
  createSendToken(user, 200, res);
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new ErrorApi("ایمیل خود را وارد کنید", 422));
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new ErrorApi("چنین کاربری وجود ندارد", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpire = Date.now() + 600000; // 1h expire date

  await user.save();

  const url = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;
  try {
    await new mailSender(req.body.email, "Reset password", url).send();
    res.status(200).json({
      status: "sucess",
      message: "لینک تغییر رمز عبور  به ایمیل شما ارسال شد",
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpire = null;
    await user.save();

    return next(new ErrorApi("مشکلی در ارسال ایمیل به وجود آمده لطفا مجدد تلاش کنید", 500));
  }
});

export const resetPasswordToken = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    where: { passwordResetToken: hashedToken, passwordResetExpire: { [Op.gt]: Date.now() } },
  });
  if (!user) return next(new ErrorApi("توکن معتبر نمیباشد", 422));

  const { passwordConfirm, password } = req.body;
  if (!passwordConfirm || !password) return next(new ErrorApi("پر کردن فیلد ها الزامی هست"), 400);

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
