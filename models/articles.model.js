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
    .query(
      `
        SELECT 
          article_id,
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
          (SELECT count(*) FROM comments WHERE articles.article_id = comments.article_id)::int AS comment_count
        FROM articles WHERE article_id = $1
      `,
      [articleId]
    )
    .then((data) => {
      if (!data.rows[0]) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return data.rows[0];
    });
};

exports.fetchArticles = (queries) => {
  const { topic, sort_by: sortBy, order: sortDirection } = queries;
  const sortByGreenList = ["author", "title", "topic", "created_at", "votes"];
  const sortDirectionGreenList = ["asc", "desc"];

  if (sortBy && !sortByGreenList.includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: `Articles can only be sorted by: ${sortByGreenList.join(", ")}!`,
    });
  }

  if (sortDirection && !sortDirectionGreenList.includes(sortDirection)) {
    return Promise.reject({
      status: 400,
      msg: `Articles can only be sorted in ascending (asc) or descending (desc) order!`,
    });
  }

  let query = `
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
  `;

  if (topic) query += format(` WHERE topic = %L`, topic);
  query += ` ORDER BY ${sortBy || "created_at"}`;
  query += ` ${sortDirection || "DESC"}`;

  return db.query(query).then((data) => {
    return { articles: data.rows };
  });
};

exports.insertArticleComment = (articleId, comment) => {
  return Promise.all([
    this.fetchArticle(articleId),
    fetchUser(comment.username),
  ])
    .then(() => {
      if (!comment.body) {
        return Promise.reject({
          status: 400,
          msg: "Comment cannot be missing!",
        });
      }
    })
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

exports.amendArticleVotes = (articleId, newVote) => {
  if (!newVote) {
    return Promise.reject({
      status: 400,
      msg: "New vote must not be missing!",
    });
  }
  if (!/^[-+]{0,1}[0-9]+$/.test(newVote)) {
    return Promise.reject({ status: 400, msg: "New vote must be an integer!" });
  }
  return this.fetchArticle(articleId).then((article) => {
    return db
      .query(
        `
          UPDATE 
            articles
          SET 
            votes = votes + $1
          WHERE
            article_id = $2
          RETURNING
            author,
            title,
            article_id,
            body,
            topic,
            created_at,
            votes,
            article_img_url;
        `,
        [newVote, articleId]
      )
      .then(({ rows: { 0: updatedArticle } }) => {
        return { article: updatedArticle };
      });
  });
};
