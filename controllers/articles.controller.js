const { fetchArticle, fetchArticles } = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID! Article ID must be a number.",
    }).catch(next);
  }
  fetchArticle(articleId)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send(articles);
  });
};
