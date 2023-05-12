const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticle,
  getArticles,
  postArticleComment,
  getArticleComments,
  updateArticleVotes,
} = require("./controllers/articles.controller");
const { deleteComment } = require("./controllers/comments.controller");
const app = express();
const errors = require("./middleware/errors.middleware");
const endpointsJson = require("./endpoints.json");

// middleware to use
app.use(express.json());

// endpoints route
app.get("/api/", (req, res, next) => {
  res.status(200).send(endpointsJson);
});

// regular routes
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticles);
app.post("/api/articles/:article_id/comments", postArticleComment);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.patch("/api/articles/:article_id", updateArticleVotes);
app.delete("/api/comments/:comment_id", deleteComment);

// final route (no valid path found)
app.use(errors.invalidPath);

// error handling middleware
// main error catching middleware to deal with custom errors
app.use(errors.customErrors);

// handle invalid inputs in request bodies
app.use(errors.invalidSubmittedData);

// fallbackError will be the final error if no other middleware can catch it
// it will return a generic 500 internal server error
app.use(errors.fallbackError);

module.exports = app;
