import express from "express";
import { getCities } from "../controller/location/getCities.js";
import { getAllProvinces } from "../controller/location/getProvince.js";

export const locationRouter = express.Router();

locationRouter.get("/getProvinces", getAllProvinces);
locationRouter.post("/getCities", getCities);
