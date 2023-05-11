const {
  fetchArticle,
  fetchArticles,
  insertArticleComment,
} = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticle(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const comment = req.body;
  insertArticleComment(articleId, comment)
    .then((insertedComment) => {
      res.status(201).send(insertedComment);
    })
    .catch(next);
};
