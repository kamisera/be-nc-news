const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
} = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  if (/[^0-9]+/.test(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID! Article ID must be a number.",
    }).catch(next);
  }
  fetchArticle(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send(articles);
  });
};

exports.getArticleComments = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleComments(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
