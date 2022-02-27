const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../errorHandling");
const connectionStartUp = require("../connection");

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
          { userid: rows[0].userid },
          process.env.JWT_SECRET
        );
        let checkValid;
        jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
          checkValid = token;
        });
        res.status(200).json({ error: "success", data: checkValid });
      } else {
        res.status(400).json({
          error: "Invalid Credentials",
        });
      }
    }
  }
}, "Something went wrong!");
