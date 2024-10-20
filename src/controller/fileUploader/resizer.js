// import sharp from "sharp";
// import catchAsync from "../../utils/catchAsync.js";

// export const resizeUserPhoto = (imageOf) =>
//   catchAsync(async (req, res, next) => {
//     if (!req.file?.fieldname) {
//       req.body.imagePath = undefined;
//       return next();
//     }
//     const randomNumber = Math.floor(Math.random() * 100000);
//     req.file.filename = `${imageOf}-${randomNumber}-${Date.now()}.png`;
//     req.body.imagePath = `/images/${imageOf}/${req.file.filename}`;
//     await sharp(req.file.buffer)
//       .resize(400, 400)
//       .toFormat("png")
//       .png({ quality: 100 })
//       .toFile(`src/public${req.body.imagePath}`);
//     next();
//   });
