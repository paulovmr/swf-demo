const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const consoleStamp = require("console-stamp")(console, {
  format: ':date(yyyy-mm-dd HH:MM:ss.l)'
});
const cors = require("cors");
const swaggerFile = require("../openapi.json");
const app = express();
const port = 3000;
const serviceName = "ticket-manager";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.post("/ticket", (req, res) => {
  // #swagger.operationId = 'createTicket'
  const ticketId = uuidv4();

  console.info("[SWF-DEMO] Ticked with id", ticketId, "was created with fields:", req.body);

  res.send({
    ticketId: ticketId,
  });
});

app.put("/ticket/:id", (req, res) => {
  // #swagger.operationId = 'updateTicket'

  console.info("[SWF-DEMO] Ticked with id", req.params.id, "was updated with fields:", req.body);

  res.sendStatus(204);
});

app.delete("/ticket/:id", (req, res) => {
  // #swagger.operationId = 'closeTicket'
  // #swagger.parameters['id'] = { description: 'ID of the ticket to be closed' }

  console.info("[SWF-DEMO] Ticked with id", req.params.id, "was closed.");

  res.sendStatus(200);
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`${serviceName} service listening on port ${port}`);
});
