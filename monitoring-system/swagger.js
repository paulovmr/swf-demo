const options = {
  openapi: "3.0.3",
};

const doc = {
  info: {
    title: "Monitoring System mock API",
  },
  host: null,
};

const swaggerAutogen = require("swagger-autogen")(options);

const outputFile = "./monitoring_system_openapi.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
