const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const store = require('store');

const swaggerFile = require("../waiting_room_openapi.json");
const app = express();
const port = process.env.PORT ?? 3005;
const serviceName = "waiting-room";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.post("/simulateUsers", (req, res) => {
  // #swagger.operationId = 'simulateUsers'
  /*  #swagger.requestBody = {
        required: true,
        schema: {
          type: 'object',
          properties: {
            numberOfUsers: { type: 'integer' }
          }
        }
      }
   */

  const usersQueueLength = store.get("usersQueueLength") ?? 0;
  const numberOfActiveUsers = store.get("numberOfActiveUsers") ?? 0;

  if (req.body.numberOfUsers > 0) {
    const newUsersQueueLength = parseFloat(usersQueueLength) + parseFloat(req.body.numberOfUsers);
    store.set("usersQueueLength", newUsersQueueLength);

    log(req.body.numberOfUsers + " users were queued.");
    log("Active users: " + numberOfActiveUsers + ". Queue length: " + newUsersQueueLength + ".");
  } else if (req.body.numberOfUsers < 0) {
    const newNumberOfActiveUsers = Math.max(numberOfActiveUsers + req.body.numberOfUsers, 0);
    store.set("numberOfActiveUsers", newNumberOfActiveUsers);

    log(numberOfActiveUsers - newNumberOfActiveUsers + " users left.");
    log("Active users: " + newNumberOfActiveUsers + ". Queue length: " + usersQueueLength + ".");
  }

  res.send({
    numberOfActiveUsers: store.get("numberOfActiveUsers") ?? 0,
    usersQueueLength: store.get("usersQueueLength") ?? 0
  });
});

app.post("/dequeueUsers", (req, res) => {
  // #swagger.operationId = 'dequeueUsers'
  /*  #swagger.requestBody = {
        required: true,
        schema: {
          type: 'object',
          properties: {
            numberOfUsers: { type: 'integer' }
          }
        }
      }
   */

  let parameters = {};

  if (req.body.numberOfPods) {
    parameters.numberOfPods = req.body.numberOfPods;
  }

  const numberOfActiveUsers = store.get("numberOfActiveUsers") ?? 0;
  const usersQueueLength = store.get("usersQueueLength") ?? 0;
  const numberOfUsersToDequeue = Math.min(parameters.numberOfUsers, usersQueueLength);

  store.set("numberOfActiveUsers", numberOfActiveUsers + numberOfUsersToDequeue);
  store.set("usersQueueLength", usersQueueLength - numberOfUsersToDequeue);

  log("Users dequeued by " + numberOfUsersToDequeue);
  log("Active users: " + store.get("numberOfActiveUsers") + ". Queue length: " + store.get("usersQueueLength") + ".");

  res.send({
    numberOfActiveUsers: store.get("numberOfActiveUsers") ?? 0,
    usersQueueLength: store.get("usersQueueLength") ?? 0
  });
});

app.get("/log/:lineNumber", (req, res) => {
  let result = "";
  let lineNumber = req.params.lineNumber;
  let logLine;
  const logSize = store.get("logSize") ?? 0;
  do {
    logLine = store.get(""+lineNumber++);
    if (logLine && lineNumber <= logSize) {
      result += logLine + "\n";
    }
  } while (logLine && lineNumber <= logSize);

  res.send(result);
});

app.get("/numbers", (req, res) => {
  res.send({
    numberOfActiveUsers: store.get("numberOfActiveUsers") ?? 0,
    usersQueueLength: store.get("usersQueueLength") ?? 0
  });
});

app.post("/reset", (req, res) => {
  store.set("logSize", 0);
  store.set("numberOfActiveUsers", 0);
  store.set("usersQueueLength", 0);
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