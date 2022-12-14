const options = {
  openapi: "3.0.3",
};

const doc = {
  info: {
    title: "Ticket Manager mock API",
  },
  host: null,
};

const swaggerAutogen = require("swagger-autogen")(options);

const outputFile = "./ticket_manager_openapi.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
