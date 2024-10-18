import multer from "multer";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ErrorApi from "../../utils/errorApi.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const memStorage = multer.memoryStorage();

const filter = function (req, file, cb) {
  const mime = file.mimetype;
  console.log("this is mime", mime);
  if (mime === "image/png") {
    cb(null, true);
  } else {
    cb(new ErrorApi("invalid image, please provide an image", 400));
  }
};
const mult = multer({ storage: memStorage, fileFilter: filter });
export const photoUploader = mult.single("avatar");
