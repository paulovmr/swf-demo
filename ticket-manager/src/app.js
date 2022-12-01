const { v4: uuidv4 } = require("uuid");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const swaggerFile = require("../openapi.json");
const app = express();
const port = 3000;
const serviceName = "ticket-manager";

app.use(cors());

app.get("/", (_req, res) => {
  res.send(`Hello from "${serviceName}" service`);
});

app.post("/ticket", (_req, res) => {
  // #swagger.operationId = 'createTicket'
  res.send({
    ticketId: uuidv4(),
  });
});

app.delete("/ticket/:id", (_req, res) => {
  // #swagger.operationId = 'closeTicket'
  // #swagger.parameters['id'] = { description: 'ID of the ticket to be closed' }
  res.sendStatus(200);
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`${serviceName} service listening on port ${port}`);
});
