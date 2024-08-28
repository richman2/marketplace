import ErrorApi from "./utils/errorApi.js";

const duplicationErrorHandle = (err, res) => {
  const error = new ErrorApi(`${Object.values(err.fields)} قبلا استفاده شده است`, 400);
  return error;
};

const validationErrorHandle = (err, res) => {
  let error = new ErrorApi(`${err.errors[0]["message"]}`, 400);
  if (err.errors[0]["type"].includes("notNull")) error = new ErrorApi("لطفا تمامی فیلد ها را پر کنید", 400);
  return error;
};
export default function handleError(err, req, res, next) {
  let error;
  console.log(err.name);
  switch (err.name) {
    case "SequelizeUniqueConstraintError":
      error = duplicationErrorHandle(err);
      break;
    case "SequelizeValidationError":
      error = validationErrorHandle(err);
      break;
    default:
      error = err;
  }
  res.status(error.status || 500).json({
    error: error.message,
  });
}
