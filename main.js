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
import { cartRouter } from "./src/routes/CartRoutes.js";
import session from "express-session";
import expressMysqlSession from "express-mysql-session";
("express-mysql-session");

dotenv.config({ path: "./config.env" });
export const app = express();
// const MySQLStore = expressMysqlSession(session);
// const sessionStore = new MySQLStore({
//   host: process.env.HOST,
//   port: 3306,
//   user: "putty",
//   password: process.env.PASSWORD,
//   database: process.env.DB,
// });
// app.use(
//   session({
//     key: "sessionId",
//     secret: "soSecretKey",
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { httpOnly: false, maxAge: 60000, path: "/" },
//   })
// );
// sessionStore
//   .onReady()
//   .then(() => {
//     console.log("mysql Ready");
//   })
//   .catch((err) => {
//     console.error(err.message);
//   });
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
app.use("/api/v1/user", userRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/cart", cartRouter);
app.all("*", (req, res, next) => {
  res.send("this route does not found");
});
app.use(handleError);
