import { Seller } from "../../models/sellerModel.js";
import { User } from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import filterField from "../../utils/filterFields.js";
import RedisApi from "../../utils/RedisApi.js";
import { findById } from "../factoryFunction.js";

const allowFields = ["storeName", "storeDescription", "storeLogo", "paymentDetails", "storePhone"];
export const createSeller = catchAsync(async (req, res, next) => {
  const allowedFields = filterField(allowFields, req.body);

  // const seller = await req.user.createSeller(allowedFields);

  // await User.update({ role: "seller" }, { where: { _userId: seller.get("_userId") } });
  // await RedisApi.deleteByKey({ ModelName: User.name, uniqueId: req.user.get("_userId") });
  const seller = await Seller.create(allowedFields);
  res.status(200).json({
    data: seller,
  });
});

export const findOneSeller = findById(Seller);
