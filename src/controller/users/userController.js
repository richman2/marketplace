import { redisClient } from "../../../main.js";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import filterField from "../../utils/filterFields.js";

const allowFields = ["firstName", "lastName", "username", "email", "phoneNumber", "imagePath"];
export const getMe = catchAsync(async (req, res, next) => {
  // const cachedUser = await redisClient.get(`${User.name}:${req.user.get("_userId")}`);
  // if (cachedUser) return res.status(200).json({ data: JSON.parse(cachedUser) });
  const user = await User.findAll({
    where: { _userId: req.user.get("_userId") },
    attributes: {
      exclude: [
        "password",
        "createdAt",
        "updatedAt",
        "role",
        "passwordResetToken",
        "passwordChangedAt",
        "passwordResetExpire",
        "logedout",
      ],
    },
  });
  // await redisClient.set(`${User.name}:${req.user.get("_userId")}`, JSON.stringify(user), "EX", 3600);
  res.status(200).json({
    data: user,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const allowedFields = filterField(allowFields, req.body);
  await User.update(allowedFields, { where: { _userId: req.user.get("_userId") } });
  res.sendStatus(201);
});
