import EmailApi from "../../helper/mailSender.js";
import { Notif } from "../../models/notification.js";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

export const consumeNotifications = catchAsync(async (req, res, next) => {
  if (req.query.status && req.query?.status !== "read" && req.query?.status !== "unread") {
    return next(new ErrorApi("Error use query parameter status (read, unread)"));
  }

  const notifs = await Notif.findAll({ where: { status: req.query.status ?? "unread" } });
  if (!notifs.length) {
    return next(new ErrorApi("there are no notifications", 404));
  }
  res.status(200).json(notifs);
  await Notif.update({ status: "read" }, { where: { status: "unread" } });
});

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
