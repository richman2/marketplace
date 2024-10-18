import { Address } from "../../models/addressModel.js";
import { Province } from "../../models/province.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

export const address = catchAsync(async (req, res, next) => {
  const { address, city, province, phoneNumber, postalCode } = req.body;

  await req.user.createAddress({ address, city, province, phoneNumber, postalCode });
  res.status(201).json();
});

export const getAddress = catchAsync(async (req, res, next) => {
  const address = await req.user.getAddresses();
  if (!address.length) return next(new ErrorApi("Nothing found", 404));
  req.address = address;
  return res.status(200).json(address);
});
