import { Notif } from "../../models/notification.js";
import { Seller } from "../../models/sellerModel.js";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";
import filterField from "../../utils/filterFields.js";
import { findById, updateOneRow } from "../factoryFunction.js";

const allowFields = ["storeName", "storeDescription", "storePhone", "website"];
export const createSeller = catchAsync(async (req, res, next) => {
  const allowedFields = filterField(allowFields, req.body);

  const seller = await req.user.createSeller(allowedFields);
  await Notif.create({
    message: seller,
  });
  return res.status(201).json({
    status: "success",
    message: "اطلاعات شما ذخیره شد و پس از تاییدیه از طرف مدیر به عنوان فروشنده میتوانید فعالیت کنید",
  });
});

export const findOneSeller = findById(Seller);
export const findMe = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOne({ where: { _userId: req.user.get("_userId") } });
  if (!seller) return next(new ErrorApi("Not found", 404));
  res.status(200).json({ data: seller });
});

export const updateSeller = catchAsync(async (req, res, next) => {
  const allowedFields = filterField(allowFields, req.body);
  await Seller.update(allowedFields, { where: { _sellerId: req.user.seller.get("_sellerId") } });
  res.sendStatus(200);
});
