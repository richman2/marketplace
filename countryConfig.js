import { Province } from "./src/models/province";
import { City } from "./src/models/citiesModel";
import catchAsync from "./src/utils/catchAsync";

export const addProv = catchAsync(async (req, res, next) => {
    
  await Province.bulkCreate(req.body);

  res.send("ok");
});

export const addCities = catchAsync(async (req, res, next) => {
  const prov = Province.findAll({ where });
});
