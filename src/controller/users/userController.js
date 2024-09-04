import { redisClient } from "../../../main.js";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";


export const getMe = catchAsync(async (req, res, next) => {
  const cachedUser = await redisClient.get(`${User.name}:${req.user.id}`);
  if (cachedUser) return res.status(200).json({ data: JSON.parse(cachedUser) });
  const user = await User.findAll({
    where: { _userId: req.user.id },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });
  await redisClient.set(`${User.name}:${req.user.id}`, JSON.stringify(user), "EX", 3600);
  res.status(200).json({
    data: user,
  });
});
