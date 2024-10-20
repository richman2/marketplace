import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const yamlDocument = YAML.load("./swagger.yaml");

app.use("/doc", swaggerUi.serve, swaggerUi.setup(yamlDocument, { swaggerOptions: { persistAuthorization: true } }));

app.listen(3344, () => {
  console.log("server is running on port 3344");
});
