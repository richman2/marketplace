import ErrorApi from './utils/errorApi.js';

const duplicationErrorHandle = (err, res) => {
  const error = new ErrorApi(`${Object.values(err.fields)} قبلا استفاده شده است`, 400);
  return error;
};

const validationErrorHandle = (err, res) => {
  return new ErrorApi(`${err.errors[0]['message']}`, 400);
};
export default function handleError(err, req, res, next) {
  let error;
  console.log(err.name);
  switch (err.name) {
    case 'SequelizeUniqueConstraintError':
      error = duplicationErrorHandle(err);
      break;
    case 'SequelizeValidationError':
      error = validationErrorHandle(err);
      break;
  }

  res.status(error?.status || 500).json({
    error: error?.message,
  });
}
