const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();
const errors = require("./middleware/errors.middleware");
const endpointsJson = require("./endpoints.json");

// endpoints route
app.get("/api/", (req, res, next) => {
  res.status(200).send(endpointsJson);
});

// regular routes
app.get("/api/topics", getTopics);

// final route (no valid path found)
app.use(errors.invalidPath);

// error handling middleware
// fallbackError will be the final error if no other middleware can catch it
// it will return a generic 500 internal server error
app.use(errors.fallbackError);

module.exports = app;
