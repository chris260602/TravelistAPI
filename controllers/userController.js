const fs = require("fs");
const bcrypt = require("bcrypt");
const { catchAsync } = require("../errorHandling");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const connectionStartUp = require("../connection");
const { checkJWTCookie, getJWTUser } = require("./cookieController");
const saltRounds = 10;
exports.newPicture = [];
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const connection = await connectionStartUp();
  if (checkJWTCookie(req, res)) {
    const user = getJWTUser(req, res);
    if (user.length > 0) {
      if (user[1] === 1) {
        const [rows, fields] = await connection.execute("SELECT * FROM users");
        res.status(200).json({
          error: "success",
          data: rows,
        });
        connection.end();
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
  const connection = await connectionStartUp();
  const userID = req.params.id;
  if (checkJWTCookie(req, res)) {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM users WHERE userid like ${userID}`
    );
    res.status(200).json({
      error: "success",
      data: rows,
    });
    connection.end();
  } else {
    res.status(400).json({
      error: "You are not authorized",
    });
  }
}, "An Error Occured when getting user");

const checkSameEmail = async (email) => {
  try {
    const connection = await connectionStartUp();
    const [rows, fields] = await connection.execute(
      `SELECT useremail FROM users WHERE useremail like '${email}'`
    );
    return rows.length;
  } catch (e) {
    return undefined;
  }
};
const validateCreateUserData = (data) => {
  let isValid = true;
  const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (data.userrole === null || data.userrole === undefined) {
    isValid = false;
  }
  if (!data.username || data.username.length < 6) {
    isValid = false;
  }
  if (!data.useremail || validEmail.test(data.useremail) === false) {
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
    let users = await checkSameEmail(req.body.useremail);
    if (users !== undefined && users === 0) {
      const connection = await connectionStartUp();
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      } catch (e) {
        res.status(400).json({
          error: "Something went wrong!",
        });
      }
      const [rows, fields] = await connection.execute(
        `INSERT INTO users (userrole,username,useremail,password,balance,isonline,profilepicture) VALUES (${req.body.userrole},'${req.body.username}','${req.body.useremail}','${hashedPassword}',0,0,'${req.body.profilepicture}')`
      );
      res.status(200).json({
        error: "success",
        data: rows,
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
  const connection = await connectionStartUp();
  const [rows, fields] = await connection.execute(
    `SELECT profilepicture FROM users WHERE userid like '${req.params.id}'`
  );
  if (rows[0].profilepicture === process.env.DEFAULT_PROFILE_PICTURE) {
    await connection.execute(
      `UPDATE users SET profilepicture = '${this.newPicture[0].location}' WHERE userid like '${req.params.id}'`
    );
  } else {
    await connection.execute(
      `UPDATE users SET profilepicture = '${this.newPicture[0].location}' WHERE userid like '${req.params.id}'`
    );
    deletePicture(rows[0].profilepicture);
  }
  setTimeout(() => {
    this.newPicture.splice(0, this.newPicture.length);
  }, 2500);
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.deleteUser = catchAsync(async (req, res, next) => {
  const connection = await connectionStartUp();
  const [rows, fields] = await connection.execute(
    `SELECT profilepicture FROM users WHERE userid like '${req.params.id}'`
  );
  if (rows[0].profilepicture !== process.env.DEFAULT_PROFILE_PICTURE) {
    deletePicture(rows[0].profilepicture);
  }
  await connection.execute(
    `DELETE FROM users WHERE userid like '${req.params.id}'`
  );
  connection.end();
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");
