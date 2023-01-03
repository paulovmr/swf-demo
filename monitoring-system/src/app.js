const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const axios = require('axios');
const store = require('store');

const swaggerFile = require("../monitoring_system_openapi.json");
const app = express();
const port = process.env.PORT ?? 3003;
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
            avgLoad: { type: 'integer' }
          }
        }
      }
   */

  const performanceData = {
    numberOfRunningPods: req.body.numberOfRunningPods,
    avgLoad: req.body.avgLoad,
  };

  log("Update - Pods: " + performanceData.numberOfRunningPods + ", Load: " + performanceData.avgLoad + "%");

  const headers = {
    'content-type': 'application/json',
    'ce-specversion': '1.0',
    'ce-source': 'monitoring',
    'ce-type': 'monitoring',
    'ce-id': '12346',
  }

  log("Cloud event requested");
  axios.post(req.body.swfDeployUrl, performanceData, {
    headers: headers
  }).then(_res => {
    log("Cloud event triggered sucessfully");
    res.sendStatus(204);
  }).catch(error => {
    log("Cloud event failed to be triggered: " + error);
    res.sendStatus(500);
  });
});

app.get("/log/:lineNumber", (req, res) => {
  const logLine = store.get(""+req.params.lineNumber);
  if (logLine) {
    res.send(logLine);
  } else {
    res.sendStatus(404);
  }
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  log(`${serviceName} service listening on port ${port}`);
});

const log = (message) => {
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/Z/, '');
  const messageWithTimestamp = "[" + timestamp + "] " + message;
  console.info(messageWithTimestamp);
  const n = store.get("logSize") ?? 0;
  store.set("" + n, messageWithTimestamp);
  store.set("logSize", n + 1);
};