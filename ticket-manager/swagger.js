const options = {
  openapi: "3.0.3",
};

const doc = {
  info: {
    title: "Ticket Manager mock API",
  },
};

const swaggerAutogen = require("swagger-autogen")(options);

const outputFile = "./openapi.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
