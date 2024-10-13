import { Province } from "../../models/province.js";
import catchAsync from "../../utils/catchAsync.js";

export const getAllProvinces = catchAsync(async (req, res, next) => {
  const provinces = await Province.findAll();
  res.status(200).json(provinces);
});
