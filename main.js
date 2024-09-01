import express from "express";
// import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { router as userRouter } from "./src/routes/userRoutes.js";
import { catRoutes } from "./src/routes/categoryRoutes.js";
import handleError from "./src/errorHandling.js";
import redis from "ioredis";
import morgan from "morgan";
export const app = express();

export const redisClient = new redis({ host: "192.168.1.4", port: "6379" });
redisClient.on("connect", () => {
  console.log("connected");
});
redisClient.on("error", (error) => {
  console.log(error);
});
app.use(express.json());
app.use(morgan("dev"));
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use("/api/v1/category", catRoutes);
app.use("/api/v1/user", userRouter);

app.all("*", (req, res, next) => {
  res.send("this route does not found");
});
app.use(handleError);
