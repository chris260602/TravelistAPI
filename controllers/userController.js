const users = require("../models/userModel");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { catchAsync } = require("../errorHandling");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const { checkJWTCookie, getJWTUser } = require("./cookieController");
const saltRounds = 10;
exports.newPicture = [];
exports.getAllUsers = catchAsync(async (req, res, next) => {
  if (checkJWTCookie(req, res)) {
    const userValid = getJWTUser(req, res);
    if (userValid.length > 0) {
      if (userValid[1] === 1) {
        const userList = await users.find();
        res.status(200).json({
          error: "success",
          data: userList,
        });
      } else {
        res.status(400).json({
          error: "You are not authorized",
        });
      }
    } else {
      res.status(400).json({
        error: "You are not authorized",
      });
    }
  } else {
    res.status(400).json({
      error: "You are not authorized",
    });
  }
}, "An error occured while getting users");

exports.getUser = catchAsync(async (req, res, next) => {
  const userID = req.params.id;
  if (checkJWTCookie(req, res)) {
    const user = await users.findById(userID).exec();
    res.status(200).json({
      error: "success",
      data: user,
    });
  } else {
    res.status(400).json({
      error: "You are not authorized",
    });
  }
}, "An Error Occured when getting user");

const checkSameEmail = async (email) => {
  try {
    const user = await users.findOne({ userEmail: email });
    if (user === null) {
      return 0;
    } else {
      return -1;
    }
  } catch (e) {
    return undefined;
  }
};
const validateCreateUserData = (data) => {
  let isValid = true;
  const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!data.userName || data.userName.length < 6) {
    isValid = false;
  }
  if (!data.userEmail || validEmail.test(data.userEmail) === false) {
    isValid = false;
  }
  if (!data.password || data.password.length < 6) {
    isValid = false;
  }
  return isValid;
};

exports.createUser = catchAsync(async (req, res, next) => {
  let isValid = validateCreateUserData(req.body);
  if (isValid) {
    let userValid = await checkSameEmail(req.body.useremail);
    if (userValid !== undefined && userValid === 0) {
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      } catch (e) {
        res.status(400).json({
          error: "Something went wrong!",
        });
      }
      const user = await users.create({
        userRole: 0,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        password: hashedPassword,
        balance: 0,
        profilePicture: req.body.profilePicture,
      });

      res.status(200).json({
        error: "success",
      });
    } else {
      res.status(400).json({
        error: "Failed to create user",
      });
    }
  } else {
    res.status(400).json({
      error: "Failed to create user",
    });
  }
}, "Error when creating user");
const deletePicture = (oldPicture) => {
  const filename = oldPicture.split("http://localhost:3003/public/img/");
  fs.unlink(`public/img/${filename[1]}`, (err) => {
    if (err) {
      console.log(`failed to delete ${filename[1]}`);
    }
  });
};

exports.changeProfilePic = catchAsync(async (req, res, next) => {
  const user = await users.findById(req.params.id);
  if (user.profilePicture === process.env.DEFAULT_PROFILE_PICTURE) {
    await users.findByIdAndUpdate(req.params.id, {
      profilePicture: this.newPicture[0].location,
    });
  } else {
    await users.findByIdAndUpdate(req.params.id, {
      profilePicture: this.newPicture[0].location,
    });
    deletePicture(user.profilePicture);
  }
  setTimeout(() => {
    this.newPicture.splice(0, this.newPicture.length);
  }, 2500);
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await users.findById(req.params.id, "profilePicture");
  if (user.profilePicture !== process.env.DEFAULT_PROFILE_PICTURE) {
    deletePicture(user.profilePicture);
  }
  await users.deleteOne({ _id: req.params.id });
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");
