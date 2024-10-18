import EmailApi from "../../helper/mailSender.js";
import { Notif } from "../../models/notification.js";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";



export const verifySeller = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const user = await User.findByPk(userId);
  const email = user.get("email");
  const sendMail = new EmailApi(email, req.body.status, req.body.reasons);

  await sendMail.send();
  if (req.body.status === "accept") {
    await User.update({ role: "seller" }, { where: { _userId: userId } });
  }
  res.status(201).json({});
});
