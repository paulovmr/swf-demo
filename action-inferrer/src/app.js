const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const store = require('store');

const swaggerFile = require("../action_inferrer_openapi.json");
const app = express();
const port = process.env.PORT ?? 3001;
const serviceName = "rhods";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.get("/action", (req, res) => {
  // #swagger.operationId = 'getAction'
  /*  #swagger.responses[200] = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                action: { type: 'string' },
                numberOfPods: { type: 'integer' },
                numberOfUsers: { type: 'integer' }
              }
            }
          }
        }
      }
   */
  const performanceData = {
    numberOfRunningPods: parseInt(req.query.numberOfRunningPods),
    avgLoad: parseInt(req.query.avgLoad),
    avgLoadPerUser: parseInt(req.query.avgLoadPerUser),
    minActivePods: parseInt(req.query.minActivePods),
    maxActivePods: parseInt(req.query.maxActivePods),
    queueLength: parseInt(req.query.queueLength)
  };

  log("Action inference requested: " + JSON.stringify(performanceData));

  let inference = {
    action: "NO_ACTION_NEEDED"
  };

  const numberOfUsersToDequeue = Math.floor(Math.min(performanceData.queueLength, (90 - performanceData.avgLoad) * performanceData.numberOfRunningPods / performanceData.avgLoadPerUser));

  if (performanceData.avgLoad > 90 || numberOfUsersToDequeue < 1) {
    inference = {
      action: "SCALE_UP",
      numberOfPods: 1
    };
  } else if (performanceData.queueLength > 0) {
    inference = {
      action: "DEQUEUE_USERS",
      numberOfUsers: numberOfUsersToDequeue
    };
  } else if (performanceData.numberOfRunningPods > 1 && performanceData.avgLoad < 50) {
    inference = {
      action: "SCALE_DOWN",
      numberOfPods: 1
    };
  }

  log("Action inference finished - Action: " + JSON.stringify(inference));
  res.send(inference);
});

app.get("/log/:lineNumber", (req, res) => {
  let result = "";
  let lineNumber = req.params.lineNumber;
  let logLine;
  do {
    logLine = store.get(""+lineNumber++);
    if (logLine) {
      result += logLine + "\n";
    }
  } while (logLine);

  res.send(result);
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