import { Notif } from "../../models/notification.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

export const consumeNotifications = catchAsync(async (req, res, next) => {

  if (req.query.status && req.query?.status !== "read" && req.query?.status !== "unread") {
    return next(new ErrorApi("Error use query parameter status (read, unread)"));
  }

  const notifs = await Notif.findAll({ where: { status: req.query.status ?? "read" } });
  if (!notifs) {
    return next(new ErrorApi("there are no notifications", 404));
  }
  res.status(200).json(notifs);
  await Notif.update({ status: "read" }, { where: { status: "unread" } });
});
