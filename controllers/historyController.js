const history = require("../models/historyModel");
const { catchAsync } = require("../errorHandling");

exports.getHistory = catchAsync(async (req, res, next) => {
  let historyList;
  if (req.query) {
    if (req.query.progress && req.query.progress === "false") {
      const historyQuery = history.find({ userID: req.params.id, status: 0 });
      historyList = await historyQuery;
    } else if (req.query.progress && req.query.progress === "true") {
      const historyQuery = history.find({ userID: req.params.id, status: 1 });
      historyList = await historyQuery;
    } else {
      const historyQuery = history.find({ userID: req.params.id });
      historyList = await historyQuery;
    }
  } else {
    const historyQuery = history.find({ userID: req.params.id });
    historyList = await historyQuery;
  }
  res.status(200).json({
    error: "success",
    data: historyList,
  });
}, "An Error Occured");

exports.getProgressHistory = catchAsync(async (req, res, next) => {
  const historyList = await history.find({ userID: req.params.id, status: 0 });
  res.status(200).json({
    error: "success",
    data: historyList,
  });
}, "An Error Occured");

exports.getDoneHistory = catchAsync(async (req, res, next) => {
  const historyList = await history.find({ userID: req.params.id, status: 1 });
  res.status(200).json({
    error: "success",
    data: historyList,
  });
}, "An Error Occured");

exports.addHistory = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  const productID = req.body.productID;
  const quantity = req.body.quantity;
  if (userID && productID && quantity) {
    await history.create({
      userID: userID,
      productID: productID,
      quantity: quantity,
    });
    res.status(200).json({
      error: "success",
    });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
}, "Something went wrong");

exports.changeHistoryStatus = catchAsync(async (req, res, next) => {
  const historyID = req.body.historyID;
  const status = req.body.status;
  if (historyID && status !== null && status !== undefined) {
    await history.findByIdAndUpdate(historyID, { status: status });
    res.status(200).json({
      error: "success",
    });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
});

exports.deleteHistory = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  if (userID) {
    await history.deleteMany({ userID: userID });
    res.status(200).json({ error: "success" });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
}, "Something went wrong");
