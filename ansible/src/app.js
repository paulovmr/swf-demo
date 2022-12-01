const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const swaggerFile = require("../openapi.json");
const app = express();
const port = 3000;
const serviceName = "ansible";

app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.post("/jobTemplate/:id", (_req, res) => {
  // #swagger.operationId = 'triggerJobTemplate'
  // #swagger.parameters['id'] = { description: 'ID of the Job Template to be triggered' }
  res.sendStatus(200);
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`${serviceName} service listening on port ${port}`);
});
