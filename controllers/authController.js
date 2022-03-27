const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const { catchAsync } = require("../errorHandling");
const { getJWTUser, checkJWTCookie } = require("./cookieController");
const users = require("../models/userModel");
const categories = require("../models/categoryModel");

exports.userLogin = catchAsync(async (req, res, next) => {
  console.log("Lewat sini");
  if (req.body.email && req.body.password) {
    const user = await users.findOne({ userEmail: req.body.email });
    if (user !== null && user.accountStatus === "Pending") {
      res.status(400).json({
        error: "Email Not Verified",
      });
    } else if (user !== null) {
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (isValid) {
        let token = jwt.sign(
          { userID: user._id, userRole: user.userRole },
          process.env.JWT_SECRET
        );
        let checkValid;
        jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
          checkValid = token;
        });
        const oneHour = 60 * 60 * 1000;
        const newDate = new Date().getTime() + oneHour;
        const cookies = new Cookies(req, res);
        cookies.set("JWTTOKEN", token, {
          expires: new Date(newDate),
          sameSite: "none",
          secure: true,
        });
        res.status(200).json({ error: "success", data: checkValid });
      } else {
        res.status(400).json({
          error: "Invalid Credentials",
        });
      }
    } else {
      res.status(400).json({
        error: "Invalid Credentials",
      });
    }
  }
}, "Something went wrong!");

exports.isAdmin = catchAsync(async (req, res, next) => {
  const user = getJWTUser(req, res);
  if (user.length > 0) {
    if (user[1] === 1) {
      return next();
    } else {
      const error = new Error("You are not authorized");
      return next(error);
    }
  } else {
    const error = new Error("You are not authorized");
    return next(error);
  }
}, "Something went wrong!");

exports.isAuthorizedUser = catchAsync(async (req, res, next) => {
  if (checkJWTCookie(req, res)) {
    const user = getJWTUser(req, res);
    if (user.length > 0 && user[0] === req.params.id) {
      return next();
    } else {
      const error = new Error("You are not authorized");
      return next(error);
    }
  } else {
    const error = new Error("You are not authorized");
    return next(error);
  }
}, "Something went wrong");

exports.isAuthorizedUserFromBody = catchAsync(async (req, res, next) => {
  if (checkJWTCookie(req, res)) {
    const user = getJWTUser(req, res);
    if (user.length > 0 && user[0] === req.body.userID) {
      return next();
    } else {
      const error = new Error("You are not authorized");
      return next(error);
    }
  } else {
    const error = new Error("You are not authorized");
    return next(error);
  }
}, "Something went wrong");

exports.isCategoryDataFound = catchAsync(async (req, res, next) => {
  const categoryList = await categories.findById(req.params.id);
  if (categoryList === null || categoryList === undefined) {
    const error = new Error("Data not Found");
    return next(error);
  } else {
    return next();
  }
}, "Something went wrong");
