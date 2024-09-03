import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findAll({
    where: { userId: req.user.id },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });

  res.status(200).json({
    data: user,
  });
});
