exports.catchAsync = (fn, msg) => (req, res, next) => {
  fn(req, res, next).catch((e) => {
    console.log(e);
    res.status(400).json({
      error: msg,
    });
  });
};
exports.errorCatching = (err, req, res, next) => {
  if (err) {
    if (err.message === "You are not authorized") {
      res.status(400).send("You are not authorized");
    } else {
      res.status(400).send("Something went wrong");
    }
  } else {
    next();
  }
};
