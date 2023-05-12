const db = require("../db/connection");

exports.destroyComment = (commentId) => {
  if (/[^0-9]+/.test(commentId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID! Comment ID must be a number.",
    });
  }
  return db
    .query(
      `
        DELETE FROM comments
        WHERE comment_id = $1;
    `,
      [commentId]
    )
    .then(({ rowCount }) => {
      if (!rowCount) {
        return Promise.reject({ status: 404, msg: "Comment not found!" });
      }
    });
};
