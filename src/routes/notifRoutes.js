import express from "express";
import { checkSeller, protect } from "../controller/guard/protect.js";
import { Notif } from "../models/notification.js";
import restrict from "../controller/guard/restrict.js";
import { OrderNotif } from "../models/orderModel.js";
import { consumeNotifications } from "../controller/notifications/notifs.js";
export const notifRouter = express.Router();

notifRouter.use(protect);
notifRouter.route("/seller").get(checkSeller, consumeNotifications(OrderNotif));
notifRouter.get("/admin", restrict(null, "manage", "admin"), consumeNotifications(Notif));
