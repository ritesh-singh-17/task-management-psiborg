const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management System API",
      version: "1.0.0",
      description: "API documentation for the Task Management System By Ritesh",
    },
    servers: [
      {
        url: process.env.SERVER_URL,
        description: "Task Management Server",
      },
    ],
  },
  apis: ["./routes/*.js"],  
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app, port) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger docs available at ${process.env.SERVER_URL}/api-docs`);
};

module.exports = setupSwaggerDocs;
