const topups = require("../models/topUpModel");
const { catchAsync } = require("../errorHandling");
const users = require("../models/userModel");

exports.getAllTopUpRequest = catchAsync(async (req, res, next) => {
  const topUpList = await topups.find();
  res.status(200).json({
    error: "success",
    data: topUpList,
  });
}, "Something went wrong");
exports.createTopUpRequest = catchAsync(async (req, res, next) => {
  const { id, amount } = req.body.data;
  const user = await users.findOne({ _id: id });
  await topups.create({
    userID: id,
    userName: user.userName,
    requestAmount: amount,
  });
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.acceptTopUpRequest = catchAsync(async (req, res, next) => {
  const { requestID, userID } = req.body.data;
  const topup = await topups.findById(requestID);
  const requestAmount = topup.requestAmount;
  users.findById(userID, (err, user) => {
    if (err) return next(err);
    user.balance = user.balance + requestAmount;
    user.save();
  });
  await topups.findByIdAndDelete(requestID);
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");
exports.declineTopUpRequest = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  await topups.findByIdAndDelete(id);
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");
