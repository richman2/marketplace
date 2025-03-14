import dotenv from "dotenv";
import { sequelize } from "./src/models/db.js";
import { app, redisClient } from "./main.js";

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;
sequelize
  // .sync({ force: true })
  // .sync({ alter: true })
  .sync()
  .then(async () => {
    await redisClient.flushall();
    console.log("connected");
    app.listen(3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
