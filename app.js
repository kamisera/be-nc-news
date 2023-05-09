const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();
const errors = require("./middleware/errors.middleware");

// regular routes
app.get("/api/topics", getTopics);

// final route (no valid path found)
app.use(errors.invalidPath);

// error handling middleware
app.use(errors.somethingElse);

module.exports = app;
