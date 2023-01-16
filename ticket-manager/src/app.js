const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const store = require('store');

const swaggerFile = require("../ticket_manager_openapi.json");
const app = express();
const port = process.env.PORT ?? 3004;
const serviceName = "ticket-manager";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.post("/ticket", (req, res) => {
  // #swagger.operationId = 'createTicket'
  /*  #swagger.responses[201] = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ticketId: { type: 'string' }
              }
            }
          }
        }
      }
   */
  const ticketId = uuidv4();

  log("Ticked with id " + ticketId + " was created with fields: " + JSON.stringify(req.body));
  store.set("numberOfOpenedTickets", 1 + (store.get("numberOfOpenedTickets") ?? 0));

  res.status(201).send({
    ticketId: ticketId,
  });
});

app.put("/ticket/:id", (req, res) => {
  // #swagger.operationId = 'updateTicket'

  log("Ticked with id " + req.params.id + " was updated with fields: " + JSON.stringify(req.body));

  res.sendStatus(204);
});

app.delete("/ticket/:id", (req, res) => {
  // #swagger.operationId = 'closeTicket'
  // #swagger.parameters['id'] = { description: 'ID of the ticket to be closed' }

  log("Ticked with id " + req.params.id + " was closed.");
  store.set("numberOfClosedTickets", 1 + (store.get("numberOfClosedTickets") ?? 0));

  res.sendStatus(200);
});

app.get("/numbers", (req, res) => {
  res.send({
    numberOfOpenedTickets: store.get("numberOfOpenedTickets") ?? 0,
    numberOfClosedTickets: store.get("numberOfClosedTickets") ?? 0
  });
});

app.get("/log/:lineNumber", (req, res) => {
  let result = "";
  let lineNumber = req.params.lineNumber;
  let logLine;
  const logSize = store.get("logSize") ?? 0;
  do {
    logLine = store.get(""+lineNumber++);
    if (logLine) {
      result += logLine + "\n";
    }
  } while (logLine && lineNumber < logSize);

  res.send(result);
});

app.post("/reset", (req, res) => {
  store.set("logSize", 0);
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
