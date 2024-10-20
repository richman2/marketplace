import express from "express";
import { addCities, getCitiesByProvinceId } from "../controller/location/cities.js";
import { addProvinces, getAllProvinces } from "../controller/location/province.js";
import restrict from "../controller/guard/restrict.js";
import { protect } from "../controller/guard/protect.js";

export const locationRouter = express.Router();

locationRouter.get("/getProvinces", getAllProvinces);
locationRouter.get("/getCities", getCitiesByProvinceId);

locationRouter.use(protect, restrict(null, "manage", "admin"));
locationRouter.post("/addProvinces", addProvinces);
locationRouter.post("/addCities", addCities);
