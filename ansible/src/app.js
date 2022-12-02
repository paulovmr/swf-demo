const express = require("express");
const swaggerUi = require("swagger-ui-express");
const consoleStamp = require("console-stamp")(console, {
  format: ':date(yyyy-mm-dd HH:MM:ss.l)'
});
const cors = require("cors");
const swaggerFile = require("../ansible_openapi.json");
const app = express();
const port = 3000;
const serviceName = "ansible";

app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.post("/jobTemplate/:id", (req, res) => {
  // #swagger.operationId = 'triggerJobTemplate'
  // #swagger.parameters['id'] = { description: 'ID of the Job Template to be triggered' }

  console.info("[SWF-DEMO] Ansible job with id", req.params.id, "was triggered.");

  res.sendStatus(200);
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`${serviceName} service listening on port ${port}`);
});
