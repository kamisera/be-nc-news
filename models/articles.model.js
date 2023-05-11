const db = require("../db/connection");

exports.fetchArticle = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((data) => {
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

exports.fetchArticleComments = (articleId) => {
  return Promise.all([
    exports.fetchArticle(articleId),
    db.query(
      `
        SELECT 
          comment_id, 
          votes, 
          created_at, 
          author, 
          body, 
          article_id
        FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC 
      `,
      [articleId]
    ),
  ]).then(({ 1: { rows: comments } }) => comments);
};
