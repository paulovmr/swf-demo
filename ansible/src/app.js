const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const store = require('store');

const swaggerFile = require("../ansible_openapi.json");
const app = express();
const port = process.env.PORT ?? 3002;
const serviceName = "ansible";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.post("/jobTemplate/:id", (req, res) => {
  // #swagger.operationId = 'triggerJobTemplate'
  // #swagger.parameters['id'] = { schema: { type: 'integer' }, description: 'ID of the Job Template to be triggered' }
  /*  #swagger.requestBody = {
        required: true,
        schema: {
          type: 'object',
          properties: {
            numberOfPods: { type: 'integer' }
          }
        }
      }
   */

  let parameters = {};

  if (req.body.numberOfPods) {
    parameters.numberOfPods = req.body.numberOfPods;
  }

  log("Ansible job with id " + req.params.id + " triggered with parameters: " + JSON.stringify(req.body));

  const numberOfActivePods = store.get("numberOfActivePods") ?? 1;

  if (req.params.id === "1") {
    store.set("numberOfActivePods", numberOfActivePods + parameters.numberOfPods);
    log("Number of pods increased by " + parameters.numberOfPods + ". Number of active pods: " + store.get("numberOfActivePods"));
  } else if (req.params.id === "2") {
    const numberOfPodsToDecrease = Math.min(parameters.numberOfPods, numberOfActivePods);
    store.set("numberOfActivePods", numberOfActivePods - numberOfPodsToDecrease);
    log("Number of pods decreased by " + numberOfPodsToDecrease + ". Number of active pods: " + store.get("numberOfActivePods"));
  }

  res.send({
    numberOfActivePods: store.get("numberOfActivePods") ?? 0
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