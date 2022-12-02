const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const consoleStamp = require("console-stamp")(console, {
  format: ':date(yyyy-mm-dd HH:MM:ss.l)'
});
const cors = require("cors");
const axios = require('axios');
const swaggerFile = require("../monitoring_system_openapi.json");
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

  console.info("[SWF-DEMO] Performance data changed - Pods:", performanceData.numberOfRunningPods, ", CPU:", performanceData.avgCpuLoad + "%", ", Memory:", performanceData.avgMemoryUsage + "%")

  const headers = {
    'content-type': 'application/json',
    'ce-specversion': '1.0',
    'ce-source': 'monitoring',
    'ce-type': 'monitoring',
    'ce-id': '12346',
  }

  console.info("[SWF-DEMO] Cloud event requested.");
  axios.post(req.body.swfDeployUrl, performanceData, {
    headers: headers
  }).then(_res => {
    console.info("[SWF-DEMO] Cloud event triggered.");
    res.sendStatus(204);
  }).catch(error => {
    console.info("[SWF-DEMO] Cloud event failed to be triggered:", error);
    res.sendStatus(500);
  });
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`${serviceName} service listening on port ${port}`);
});
