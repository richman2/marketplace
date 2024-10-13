import { Authorization } from "../../helper/caslAuth.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

export default function (Model, action, role) {
  return catchAsync(async (req, _, next) => {
    if (Model) {
      const doc = await Model.findByPk(req.params.id);
      const canDo = new Authorization(req.user, doc, action, Model).canDo();
      if (!canDo) return next(new ErrorApi("Forbiden", 403));
    }
    switch (role) {
      case "admin":
        const canManage = new Authorization(req.user, null, action).isadmin();
        if (!canManage) return next(new ErrorApi("Forbiden", 403));
        break;
      case "seller":
        if (!new Authorization(req.user, null, null).isSeller()) return next(new ErrorApi("Forbiden", 403));
        break;
    }
    next();
  });
}
