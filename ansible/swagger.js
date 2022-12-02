const options = {
  openapi: "3.0.3",
};

const doc = {
  info: {
    title: "Ansible mock API",
  },
  host: null,
};

const swaggerAutogen = require("swagger-autogen")(options);

const outputFile = "./ansible_openapi.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
