const path = require("path");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const bcrypt = require("bcrypt");
const connectionStartUp = require("../connection");
const { catchAsync } = require("../errorHandling");
const { checkJWTCookie, getJWTUser } = require("./cookieController");
exports.totalFiles = [];
exports.getAllProducts = catchAsync(async (req, res, next) => {
  checkJWTCookie(req, res);
  const connection = await connectionStartUp();
  [rows, fields] = await connection.execute("SELECT * FROM products");
  res.status(200).json({
    error: "success",
    data: rows,
  });
  connection.end();
}, "Something went wrong");

const getPicture = () => {
  const newPicture = [];
  let mainpicture = this.totalFiles.filter(
    (picture) => picture.fieldname === "mainpicture"
  );
  if (mainpicture.length === 0) {
    mainpicture = null;
  } else {
    mainpicture = mainpicture[0].location;
  }
  newPicture.push(mainpicture);
  let picture2 = this.totalFiles.filter(
    (picture) => picture.fieldname === "picture2"
  );
  if (picture2.length === 0) {
    picture2 = null;
  } else {
    picture2 = picture2[0].location;
  }
  newPicture.push(picture2);
  let picture3 = this.totalFiles.filter(
    (picture) => picture.fieldname === "picture3"
  );
  if (picture3.length === 0) {
    picture3 = null;
  } else {
    picture3 = picture3[0].location;
  }
  newPicture.push(picture3);
  let picture4 = this.totalFiles.filter(
    (picture) => picture.fieldname === "picture4"
  );
  if (picture4.length === 0) {
    picture4 = null;
  } else {
    picture4 = picture4[0].location;
  }
  newPicture.push(picture4);
  return newPicture;
};
const checkCategory = (category) => {
  if (
    category === "Bathroom" ||
    category === "Electronics" ||
    category === "Kitchen" ||
    category === "Clothes" ||
    category === "BeautyHealth" ||
    category === "Tools" ||
    category === "Bag" ||
    category === "Accessories" ||
    category === "FoodDrinks" ||
    category === "Bed" ||
    category === "Pest Control" ||
    category === "Games"
  ) {
    return true;
  } else {
    return false;
  }
};
exports.createProduct = catchAsync(async (req, res, next) => {
  const userid = getJWTUser(req, res);
  if (userid >= 0) {
    const connection = await connectionStartUp();
    const [rows, fields] = await connection.execute(
      `SELECT userid, userrole from users WHERE userid like '${userid}'`
    );
    if (rows[0].userrole === 1) {
      const pictures = getPicture();
      if (
        req.body.name &&
        req.body.price &&
        req.body.price >= 0 &&
        req.body.stocks &&
        req.body.stocks >= 0 &&
        req.body.category &&
        checkCategory(req.body.category) &&
        req.body.content &&
        pictures[0] !== null
      ) {
        const [rows, fields] = await connection.execute(
          `INSERT INTO products (productname,	price,	productsold,	productstocks,	category,	content,mainpicture,	picture2,	picture3,	picture4) VALUES ('${req.body.name}',${req.body.price},0,${req.body.stocks},'${req.body.category}','${req.body.content}','${pictures[0]}','${pictures[1]}','${pictures[2]}','${pictures[3]}')`
        );
        res.status(200).json({
          error: "success",
          data: rows,
        });
      } else {
        res.status(400).json({
          error: "Something went wrong",
        });
      }

      this.totalFiles.splice(0, this.totalFiles.length);
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
}, "Something went wrong");
