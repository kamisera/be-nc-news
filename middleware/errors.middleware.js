// default response for invalid paths
exports.invalidPath = (req, res, next) => {
  res.status(404).send({
    msg: "Invalid path!",
  });
  next();
};

// handle custom errors we created
exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

// send internal server error status if the error cannot be categorised elsewhere
exports.fallbackError = (err, req, res, next) => {
  res.status(500).send({
    msg: "Something went wrong!",
  });
};
