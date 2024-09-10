import { Authorization } from "../../helper/caslAuth.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

export default function (Model, action) {
  return catchAsync(async (req, _, next) => {
    const doc = await Model.findByPk(req.params.id);
    const canDo = await new Authorization(req.userData, doc, action, Model).canDo();
    if (!canDo) return next(new ErrorApi("Forbiden", 403));
    next();
  });
}
