const db = require("../db/connection");

exports.fetchArticle = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((data) => {
      return data.rows[0];
    });
};
