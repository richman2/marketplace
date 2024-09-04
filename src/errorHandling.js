import ErrorApi from "./utils/errorApi.js";

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.includes("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  }
  console.log("Error occured", err);
  return res.status(500).json({
    status: "error",
    message: "something went wrong",
  });
};
const duplicationErrorHandle = (err, res) => {
  const error = new ErrorApi(`${Object.values(err.fields)} قبلا استفاده شده است`, 400);
  return error;
};

const validationErrorHandle = (err, res) => {
  console.log(err);
  let error = new ErrorApi(`${err.errors[0]["message"]}`, 400);
  if (err.errors[0]["type"].includes("notNull")) error = new ErrorApi("لطفا تمامی فیلد ها را پر کنید", 400);
  return error;
};
export default function handleError(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error;
    switch (err.name) {
      case "SequelizeUniqueConstraintError":
        error = duplicationErrorHandle(err);
        break;
      case "SequelizeValidationError":
        error = validationErrorHandle(err);
        break;
      case "TokenExpiredError":
        error = new ErrorApi("Token expired", 400);
        break;
      case "JsonWebTokenError":
        error = new ErrorApi("Provide a valid token", 400);
        break;
      default:
        error = err;
    }
    sendErrorProd(error, req, res);
  }
}
