const express = require("express");
const swaggerUi = require("swagger-ui-express");
const consoleStamp = require("console-stamp")(console, {
  format: ':date(yyyy-mm-dd HH:MM:ss.l)'
});
const cors = require("cors");
const swaggerFile = require("../openapi.json");
const app = express();
const port = 3000;
const serviceName = "action-inferrer";

app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.get("/action", (req, res) => {
  // #swagger.operationId = 'getAction'
  const performanceData = {
    numberOfRunningPods: parseInt(req.query.numberOfRunningPods),
    avgCpuLoad: parseInt(req.query.avgCpuLoad),
    avgMemoryUsage: parseInt(req.query.avgMemoryUsage),
  };

  console.info("[SWF-DEMO] Action inference requested - Pods:", performanceData.numberOfRunningPods, ", CPU:", performanceData.avgCpuLoad + "%", ", Memory:", performanceData.avgMemoryUsage + "%")

  let inference = {
    action: "NO_ACTION_NEEDED",
    params: {}
  };

  if (performanceData.avgCpuLoad > 90 || performanceData.avgMemoryUsage > 90) {
    inference = {
      action: "SCALE_UP",
      params: {
        numberOfPods: 2,
      }
    };
  } else if (performanceData.avgCpuLoad > 80 || performanceData.avgMemoryUsage > 80) {
    inference = {
      action: "SCALE_UP",
      params: {
        numberOfPods: 1,
      }
    };
  } else if (performanceData.numberOfRunningPods > 2 && (performanceData.avgCpuLoad < 30 || performanceData.avgMemoryUsage < 30)) {
    inference = {
      action: "SCALE_DOWN",
      params: {
        numberOfPods: 2,
      },
    };
  } else if (performanceData.numberOfRunningPods > 1 && (performanceData.avgCpuLoad < 50 || performanceData.avgMemoryUsage < 50)) {
    inference = {
      action: "SCALE_DOWN",
      params: {
        numberOfPods: 1,
      },
    };
  }

  console.info("[SWF-DEMO] Action inference finished - Action:", inference.action, ", params:", inference.params);
  res.send(inference);
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`${serviceName} service listening on port ${port}`);
});
