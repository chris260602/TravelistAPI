const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const { catchAsync } = require("../errorHandling");
const connectionStartUp = require("../connection");
const { getJWTUser } = require("./cookieController");

exports.userLogin = catchAsync(async (req, res, next) => {
  if (req.body.email && req.body.password) {
    const connection = await connectionStartUp();
    const [rows, fields] = await connection.execute(
      `SELECT * FROM users WHERE useremail like '${req.body.email}'`
    );
    if (rows.length >= 1) {
      const isValid = await bcrypt.compare(req.body.password, rows[0].password);
      if (isValid) {
        let token = jwt.sign(
          { userid: rows[0].userid, userrole: rows[0].userrole },
          process.env.JWT_SECRET
        );
        let checkValid;
        jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
          checkValid = token;
        });
        const oneHour = 60 * 60 * 1000;
        const newDate = new Date().getTime() + oneHour;
        const cookies = new Cookies(req, res);
        cookies.set("JWTTOKEN", token, { expires: new Date(newDate) });
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
  const userid = getJWTUser(req, res);
  if (userid >= 0) {
    const connection = await connectionStartUp();
    const [rows, fields] = await connection.execute(
      `SELECT userid, userrole from users WHERE userid like '${userid}'`
    );
    // console.log(rows);
    if (rows[0].userrole === 1) {
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
