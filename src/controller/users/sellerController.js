import { Seller } from "../../models/sellerModel.js";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import filterField from "../../utils/filterFields.js";
import { findById } from "../factoryFunction.js";

const allowFields = ["storeName", "storeDescription", "storeLogo", "paymentDetails", "storePhone"];
export const createSeller = catchAsync(async (req, res, next) => {
  const allowedFields = filterField(allowFields, req.body);
  allowedFields._userId = req.user.id;
  const seller = await Seller.create(allowedFields);
  await User.update({ role: "seller" }, { where: { _userId: req.user.id } });
  seller;
  res.status(200).json({
    data: seller,
  });
});

export const findOneSeller = findById(Seller);
