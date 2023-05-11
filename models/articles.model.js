const db = require("../db/connection");
const format = require("pg-format");
const { fetchUser } = require("./users.model");

exports.fetchArticle = (articleId) => {
  if (/[^0-9]+/.test(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID! Article ID must be a number.",
    });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((data) => {
      if (!data.rows[0]) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return data.rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `
        SELECT 
          author,
          title,
          article_id,
          topic,
          created_at,
          votes,
          article_img_url,
          (SELECT count(*) FROM comments WHERE articles.article_id = comments.article_id)::int AS comment_count
        FROM articles 
        ORDER BY created_at DESC;
      `
    )
    .then((data) => {
      return { articles: data.rows };
    });
};

exports.insertArticleComment = (articleId, comment) => {
  return Promise.all([
    this.fetchArticle(articleId),
    fetchUser(comment.username),
  ])
    .then(() => {
      const insertQuery = format(
        `
        INSERT INTO comments
          (author, body, article_id)
        VALUES
          (%L)
        RETURNING *;
      `,
        [comment.username, comment.body, articleId]
      );
      return db.query(insertQuery);
    })
    .then(({ rows: { 0: returnedComment } }) => {
      return { comment: returnedComment };
    });
};
