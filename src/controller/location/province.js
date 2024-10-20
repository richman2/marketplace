import { Province } from "../../models/province.js";
import catchAsync from "../../utils/catchAsync.js";
import { addMany, addOne, deleteOneRowByKey, findAll } from "../factoryFunction.js";

export const getAllProvinces = findAll(Province);
export const addProvinces = addMany(Province, ["provinceName", " status"]);
export const addOneProvince = addOne(Province, ["provinceName", "status"]);
export const deleteOneProvince = deleteOneRowByKey(Province, "_provId");
