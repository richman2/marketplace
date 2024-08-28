import { User } from '../../models/userModel.js';
import catchAsync from '../../utils/catchAsync.js';

export const signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, username, password, passwordConfirm, email } = req.body;
  await User.create({ firstName, lastName, username, email, password, passwordConfirm });

  res.status(200).json({
    status: 'success',
  });
});
