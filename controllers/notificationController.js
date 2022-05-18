const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const bcrypt = require("bcrypt");
const { catchAsync } = require("../errorHandling");
const { checkJWTCookie, getJWTUser } = require("./cookieController");
const notifications = require("../models/notificationModel");
const users = require("../models/userModel");

exports.getAllNotification = catchAsync(async (req, res, next) => {
  const notificationList = await notifications.find();
  res.status(200).json({
    error: "success",
    data: notificationList,
  });
}, "Something went wrong");

exports.getNotificationById = catchAsync(async (req, res, next) => {
  //   console.log(req.params.id);
  const { id } = req.params;
  const notificationList = await notifications.find({ userID: id });
  res.status(200).json({
    error: "success",
    data: notificationList,
  });
}, "Something went wrong");

exports.sendNotificationToUser = catchAsync(async (req, res, next) => {
  const { userID, notification } = req.body;
  await notifications.create({
    userID: userID,
    type: notification.type,
    title: notification.title,
    content: notification.content,
  });
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.sendNotificationToAll = catchAsync(async (req, res, next) => {
  const { notification } = req.body;
  const userList = await users.find({
    userRole: { $ne: 1 },
    accountStatus: { $ne: "Pending" },
  });
  userList.forEach(async (user) => {
    await notifications.create({
      userID: user._id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
    });
  });

  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.deleteNotificationAll = catchAsync(async (req, res, next) => {
  await notifications.deleteMany();

  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");
exports.deleteNotificationById = catchAsync(async (req, res, next) => {
  const { notificationID } = req.body;
  await notifications.findByIdAndDelete(notificationID);

  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");
exports.deleteUserNotification = catchAsync(async (req, res, next) => {
  const { userID } = req.body;
  await notifications.deleteMany({ userID: userID });

  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.updateSeenNotification = catchAsync(async (req, res, next) => {
  const { notificationID } = req.body;
  await notifications.findByIdAndUpdate(notificationID, { seen: true });

  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");
