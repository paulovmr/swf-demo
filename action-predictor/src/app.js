const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');
const app = express();
const port = 3000;

app.get('/action', (req, res) => {
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
  }

  res.send({
    action: "NO_ACTION_NEEDED"
  });
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
