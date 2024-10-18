import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

export const consumeNotifications = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.query.status && req.query?.status !== "read" && req.query?.status !== "unread") {
      return next(new ErrorApi("Error use query parameter status (read, unread)"));
    }

    const notifs = await Model.findAll({ where: { status: req.query.status ?? "unread" } });
    if (!notifs.length) {
      return next(new ErrorApi("there are no notifications", 404));
    }
    res.status(200).json(notifs);
    await Model.update({ status: "read" }, { where: { status: "unread" } });
  });
