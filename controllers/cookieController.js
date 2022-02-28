const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const catchAsync = require("../errorHandling");
const connectionStartUp = require("../connection");

exports.checkJWTCookie = (req, res) => {
  let cookies = new Cookies(req, res);
  const JWTTOKEN = cookies.get("JWTTOKEN");
  if (JWTTOKEN !== undefined) {
    let isValid;
    jwt.verify(JWTTOKEN, process.env.JWT_SECRET, (err, token) => {
      isValid = token;
    });
    if (isValid !== undefined) {
      const oneHour = 60 * 60 * 1000;
      const newDate = new Date().getTime() + oneHour;
      cookies.set("JWTTOKEN", JWTTOKEN, { expires: new Date(newDate) });
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
exports.getJWTUser = (req, res) => {
  let cookies = new Cookies(req, res);
  const JWTTOKEN = cookies.get("JWTTOKEN");
  if (JWTTOKEN !== undefined) {
    let isValid;
    jwt.verify(JWTTOKEN, process.env.JWT_SECRET, (err, token) => {
      isValid = token;
    });
    if (isValid !== undefined) {
      const oneHour = 60 * 60 * 1000;
      const newDate = new Date().getTime() + oneHour;
      cookies.set("JWTTOKEN", JWTTOKEN, { expires: new Date(newDate) });
      return isValid.userid;
    } else {
      return -1;
    }
  } else {
    return -1;
  }
};
