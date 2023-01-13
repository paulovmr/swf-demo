const options = {
  openapi: "3.0.3",
};

const doc = {
  info: {
    title: "Waiting room mock API",
  },
  host: null,
};

const swaggerAutogen = require("swagger-autogen")(options);

const outputFile = "./waiting_room_openapi.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
