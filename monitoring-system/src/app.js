const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const swaggerFile = require("../openapi.json");
const app = express();
const port = 3000;
const serviceName = "monitoring-system";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.post("/performanceData", (req, res) => {
  // #swagger.operationId = 'changePerformanceData'
  /*  #swagger.requestBody = {
        required: true,
        schema: {
          type: 'object',
          properties: {
            numberOfRunningPods: { type: 'integer' },
            avgCpuLoad: { type: 'integer' },
            avgMemoryUsage: { type: 'integer' }
          }
        }
      }
   */

  const performanceData = {
    numberOfRunningPods: parseInt(req.body.numberOfRunningPods),
    avgCpuLoad: parseInt(req.body.avgCpuLoad),
    avgMemoryUsage: parseInt(req.body.avgMemoryUsage),
  };

  console.info(">> Performance data changed - Pods:", performanceData.numberOfRunningPods, ", CPU:", performanceData.avgCpuLoad + "%", ", Memory:", performanceData.avgMemoryUsage + "%")

  console.info(">> Workflow triggered");
  // TODO Trigger event to start workflow

  res.sendStatus(204);
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`${serviceName} service listening on port ${port}`);
});
