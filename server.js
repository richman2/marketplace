import { app, redisClient } from "./main.js";
import dotenv from "dotenv";
import { sequelize } from "./src/models/db.js";
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;
sequelize
  // .sync({ force: true, alter: true })
  // .sync({alter: true})
  .sync()
  .then(async () => {
    await redisClient.flushall();
    console.log("connected");
    app.listen(3000, () => {
      console.log("server is run");
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is listening on port ${PORT}`);
});
