import multer from "multer";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ErrorApi from "../../utils/errorApi.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
// const memStorage = multer.memoryStorage();

// const filter = function (req, file, cb) {
//   const mime = file.mimetype;
//   console.log("this is mime", mime);
//   if (mime === "image/png") {
//     cb(null, true);
//   } else {
//     cb(new ErrorApi("invalid image, please provide an image", 400));
//   }
// };
// const mult = multer({ storage: memStorage, fileFilter: filter });
// export const photoUploader = mult.single("avatar");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.baseUrl);
    cb(null, `./src/public/images/${req.baseUrl.split("/").at(-1)}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + ".png";
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const filter = (req, file, cb) => {
  const mime = file.mimetype;
  if (mime === "image/png") {
    cb(null, true);
  } else {
    cb(new ErrorApi("invalid image, please provide an image", 400));
  }
};

const upload = multer({ storage: storage, fileFilter: filter, limits: 1 });

export const imageUploader = upload.single("avatar");
