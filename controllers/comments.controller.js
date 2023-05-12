const { destroyComment } = require("../models/comments.model");

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  destroyComment(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
