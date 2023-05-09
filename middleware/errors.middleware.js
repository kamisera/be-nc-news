exports.invalidPath = (req, res, next) => {
  res.status(404).send({
    msg: "Invalid path!",
  });
  next();
};

// send internal server error status if the error cannot be categorised elsewhere
exports.fallbackError = (err, req, res, next) => {
  res.status(500).send({
    msg: "Something went wrong!",
  });
};
