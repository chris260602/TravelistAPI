module.exports = catchAsync = (fn, msg) => (req, res, next) => {
  fn(req, res, next).catch((e) => {
    console.log(e);
    res.status(400).json({
      error: msg,
    });
  });
};
