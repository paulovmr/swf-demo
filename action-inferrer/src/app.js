const express = require("express");
const swaggerUi = require("swagger-ui-express");
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

  console.info(">> Action inference requested - Pods:", performanceData.numberOfRunningPods, ", CPU:", performanceData.avgCpuLoad + "%", ", Memory:", performanceData.avgMemoryUsage + "%")

  let inference = {
    action: "NO_ACTION_NEEDED",
    params: {}
  };

  if (performanceData.numberOfRunningPods === 1) {
    inference = {
      action: "SCALE_UP",
      params: {
        numberOfPods: 1,
      }
    };
  } else if (performanceData.numberOfRunningPods === 2) {
    inference = {
      action: "SCALE_DOWN",
      params: {
        numberOfPods: 1,
      },
    };
  } else if (performanceData.numberOfRunningPods === 3) {
    inference = {
      action: "DEQUEUE_USERS",
      params: {
        numberOfUsers: 1,
      },
    };
  } else if (performanceData.numberOfRunningPods === 4) {
    inference = {
      action: "TRIGGER_WORKFLOW",
      params: {
        workflowId: "workflowId",
        params: {
          customParam: "customParam",
        },
      },
    };
  }

  console.info(">> Action inference finished - Action:", inference.action, ", params:", inference.params);
  res.send(inference);
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`${serviceName} service listening on port ${port}`);
});
