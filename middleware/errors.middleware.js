exports.invalidPath = (req, res, next) => {
  res.status(404).send({
    msg: "Invalid path!",
  });
  next();
};

exports.somethingElse = (err, req, res, next) => {
  res.status(500).send({
    msg: "Something went wrong!",
  });
};
