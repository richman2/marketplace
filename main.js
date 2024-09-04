import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
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
dotenv.config({ path: "./config.env" });
export const app = express();

export const redisClient = new redis({ host: process.env.HOST, port: "6379" });
redisClient.on("connect", () => {
  console.log("connected");
});
redisClient.on("error", (error) => {
  console.log(error);
});
app.use(express.json());
app.use(morgan("dev"));
const __dirname = dirname(fileURLToPath(import.meta.url));

app.options(
  "*",
  cors({
    credentials: true,
    origin: ["*"], // Whitelist the domains you want to allow
  })
);
app.use("/api/v1/category", catRouter);
app.use("/api/v1/product", prodRouter);
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/user', userRouter)
app.use('/api/v1/seller', sellerRouter)

app.all("*", (req, res, next) => {
  res.send("this route does not found");
});
app.use(handleError);
