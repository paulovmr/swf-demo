const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerFile = require('../openapi.json');
const app = express();
const port = 3000;

app.use(cors());

app.get('/action', (req, res) => {
  // #swagger.operationId = 'getAction'
  const performanceData = {
    numberOfRunningPods: parseInt(req.query.numberOfRunningPods),
    avgCpuLoad: parseInt(req.query.cpuLoad),
    avgMemoryUsage: parseInt(req.query.memoryUsage),
  };

  if (performanceData.numberOfRunningPods === 1) {
    res.send({
      action: "SCALE_UP",
      params: {
        numberOfPods: 1
      }
    });
  } else if (performanceData.numberOfRunningPods === 2) {
    res.send({
      action: "SCALE_DOWN",
      params: {
        numberOfPods: 1
      }
    });
  } else if (performanceData.numberOfRunningPods === 3) {
    res.send({
      action: "DEQUEUE_USERS",
      params: {
        numberOfUsers: 1
      }
    });
  } else if (performanceData.numberOfRunningPods === 4) {
    res.send({
      action: "TRIGGER_WORKFLOW",
      params: {
        workflowId: "workflowId",
        params: {
          customParam: "customParam"
        }
      }
    });
  } else {
    res.send({
      action: "NO_ACTION_NEEDED"
    });
  }
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`action-predictor service listening on port ${port}`);
});
