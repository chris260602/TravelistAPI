const bcrypt = require("bcrypt");
const catchAsync = require("../errorHandling");
const connectionStartUp = require("../connection");
const saltRounds = 10;

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const connection = await connectionStartUp();
  const [rows, fields] = await connection.execute(
    "SELECT userid,userrole,username,useremail,password,balance,isonline FROM users"
  );
  res.status(200).json({
    error: "success",
    data: rows,
  });
  connection.end();
}, "An error occured while getting users");

exports.getUser = catchAsync(async (req, res, next) => {
  const connection = await connectionStartUp();
  const userID = req.params.id;
  const [rows, fields] = await connection.execute(
    `SELECT userid,userrole,username,useremail,password,balance,isonline FROM users WHERE userid like ${userID}`
  );
  res.status(200).json({
    error: "success",
    data: rows,
  });
  connection.end();
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
        `INSERT INTO users (userrole,username,useremail,password,balance,isonline,profilepicture) VALUES (${req.body.userrole},'${req.body.username}','${req.body.useremail}','${hashedPassword}',0,0,'COMINGSOON')`
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
