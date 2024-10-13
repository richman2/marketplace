import { City } from "../../models/citiesModel.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

export const getCities = catchAsync(async (req, res, next) => {
  const { province } = req.body;
  if (province) return next(new ErrorApi("آیدی استان را وارد کنید", 400));
  const cities = await City.findAll({ where: { _provId: province } });
  res.status(200).json(cities);
});
