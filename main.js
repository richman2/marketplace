import express from "express";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import { authRouter } from "./src/routes/authRoutes.js";
import { catRouter } from "./src/routes/categoryRoutes.js";
import handleError from "./src/errorHandling.js";
import redis from "ioredis";
import morgan from "morgan";
import cors from "cors";
import { prodRouter } from "./src/routes/productRoutes.js";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/userRoutes.js";
import { sellerRouter } from "./src/routes/SellerRoutes.js";
import { cartRouter } from "./src/routes/CartRoutes.js";
import { association } from "./src/models/association.js";
import { adminRouter } from "./src/routes/adminRoutes.js";
import { payRouter } from "./src/routes/peymentRoutes.js";
import { discountRouter } from "./src/routes/discountRoutes.js";
import { locationRouter } from "./src/routes/locationRoutes.js";
import { reviewRouter } from "./src/routes/reviewRoutes.js";
import { invoiceRouter } from "./src/routes/invoiceRoutes.js";
import { orderRouter } from "./src/routes/orderRoutes.js";
import { notifRouter } from "./src/routes/notifRoutes.js";

dotenv.config({ path: "./config.env" });
export const app = express();

export const redisClient = new redis({ host: "192.168.1.5", port: "6379" });
redisClient.on("connect", () => {
  console.log("connected");
});
redisClient.on("error", (error) => {
  console.log(error);
});
app.use(express.json());
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "src/public")));
app.use(morgan("dev"));
app.use(
  "*",
  cors({
    credentials: true,
    origin: "*", // Whitelist the domains you want to allow
  })
);
//
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/payment", payRouter);
app.use("/api/v1/category", catRouter);
app.use("/api/v1/product", prodRouter);
app.use("/api/v1/discount", discountRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/invoice", invoiceRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notif/", notifRouter);
app.all("*", (req, res, next) => {
  res.send("this route does not found");
});
app.use(handleError);
