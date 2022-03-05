const fs = require("fs");
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

exports.getProduct = catchAsync(async (req, res, next) => {
  checkJWTCookie(req, res);
  const connection = await connectionStartUp();
  [rows, fields] = await connection.execute(
    `SELECT * FROM products WHERE productid like '${req.params.id}'`
  );
  if (rows.length > 0) {
    res.status(200).json({
      error: "success",
      data: rows,
    });
  } else {
    res.status(400).json({
      error: "No data available",
    });
  }
  connection.end();
}, "Something went wrong");

const deletePicture = () => {
  for (let i = 0; i < this.totalFiles.length; i++) {
    if (this.totalFiles[i] !== null) {
      const filename = this.totalFiles[i].location.split(
        "http://localhost:3003/public/img/"
      );
      fs.unlink(`public/img/${filename[1]}`, (err) => {
        if (err) {
          console.log(`failed to delete ${filename[1]}`);
        }
      });
    }
  }
};

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
        setTimeout(() => {
          deletePicture();
        }, 2500);
        res.status(400).json({
          error: "Something went wrong",
        });
      }
      setTimeout(() => {
        this.totalFiles.splice(0, this.totalFiles.length);
      }, 2500);
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

const deleteOldPictureHelper = catchAsync(async (rows, target) => {
  let filename;
  if (target === 1) {
    filename = rows.mainpicture.split("http://localhost:3003/public/img/");
  } else if (target === 2) {
    filename = rows.picture2.split("http://localhost:3003/public/img/");
  } else if (target === 3) {
    filename = rows.picture3.split("http://localhost:3003/public/img/");
  } else if (target === 4) {
    filename = rows.picture4.split("http://localhost:3003/public/img/");
  }
  fs.unlink(`public/img/${filename[1]}`, (err) => {
    if (err) {
      console.log(`failed to delete ${filename[1]}`);
    }
  });
}, "Something went wrong");

const changeOldPicture = catchAsync(
  async (newPicture, productid, pictureqty) => {
    const connection = await connectionStartUp();
    const [rows, fields] = await connection.execute(
      `SELECT mainpicture, picture2,picture3,picture4 from products WHERE productid like '${productid}'`
    );
    const oldRows = rows;
    if (newPicture[0] !== null) {
      if (oldRows[0].mainpicture !== "null") {
        deleteOldPictureHelper(oldRows[0], 1);
      }
      const [rows, fields] = await connection.execute(
        `UPDATE products SET mainpicture = '${newPicture[0]}' WHERE productid like '${productid}'`
      );
    }
    if (newPicture[1] !== null || oldRows[0].picture2 !== "null") {
      if (newPicture[1] !== null && oldRows[0].picture2 === "null") {
        await connection.execute(
          `UPDATE products SET picture2 = '${newPicture[1]}' WHERE productid like '${productid}'`
        );
      } else if (
        (oldRows[0].picture2 !== "null" && pictureqty < 2) ||
        newPicture[1] !== null
      ) {
        deleteOldPictureHelper(oldRows[0], 2);
        await connection.execute(
          `UPDATE products SET picture2 = '${newPicture[1]}' WHERE productid like '${productid}'`
        );
      }
    }
    if (newPicture[2] !== null || oldRows[0].picture3 !== "null") {
      if (newPicture[2] !== null && oldRows[0].picture3 === "null") {
        await connection.execute(
          `UPDATE products SET picture3 = '${newPicture[2]}' WHERE productid like '${productid}'`
        );
      } else if (
        (oldRows[0].picture3 !== "null" && pictureqty < 3) ||
        newPicture[2] !== null
      ) {
        deleteOldPictureHelper(oldRows[0], 3);
        await connection.execute(
          `UPDATE products SET picture3 = '${newPicture[2]}' WHERE productid like '${productid}'`
        );
      }
    }
    if (newPicture[3] !== null || oldRows[0].picture4 !== "null") {
      if (newPicture[3] !== null && oldRows[0].picture4 === "null") {
        await connection.execute(
          `UPDATE products SET picture4 = '${newPicture[3]}' WHERE productid like '${productid}'`
        );
      } else if (
        (oldRows[0].picture4 !== "null" && pictureqty < 4) ||
        newPicture[3] !== null
      ) {
        deleteOldPictureHelper(oldRows[0], 4);
        await connection.execute(
          `UPDATE products SET picture4 = '${newPicture[3]}' WHERE productid like '${productid}'`
        );
      }
    }
    connection.end();
  },
  "Something went wrong"
);

exports.updateProduct = catchAsync(async (req, res, next) => {
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
        req.body.pictureqty &&
        checkCategory(req.body.category) &&
        req.body.content
      ) {
        changeOldPicture(pictures, req.params.id, req.body.pictureqty);

        const [rows, fields] = await connection.execute(
          `UPDATE products SET productname = '${req.body.name}',	price = ${req.body.price},	productstocks = ${req.body.stocks},	category = '${req.body.category}',	content = '${req.body.content}' WHERE productid like '${req.params.id}'`
        );
        res.status(200).json({
          error: "success",
          data: rows,
        });
      } else {
        setTimeout(() => {
          deletePicture();
        }, 2500);
        res.status(400).json({
          error: "Something went wrong",
        });
      }
      setTimeout(() => {
        this.totalFiles.splice(0, this.totalFiles.length);
      }, 2500);
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

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const userid = getJWTUser(req, res);
  if (userid >= 0) {
    const connection = await connectionStartUp();
    const [rows, fields] = await connection.execute(
      `SELECT userid, userrole from users WHERE userid like '${userid}'`
    );
    if (rows[0].userrole === 1) {
      const [rows, fields] = await connection.execute(
        `SELECT mainpicture, picture2,picture3,picture4 from products WHERE productid like '${req.params.id}'`
      );
      const images = rows[0];
      if (images.mainpicture !== "null") {
        deleteOldPictureHelper(images, 1);
      }
      if (images.picture2 !== "null") {
        deleteOldPictureHelper(images, 2);
      }
      if (images.picture3 !== "null") {
        deleteOldPictureHelper(images, 3);
      }
      if (images.picture4 !== "null") {
        deleteOldPictureHelper(images, 4);
      }
      await connection.execute(
        `DELETE FROM products WHERE productid like '${req.params.id}'`
      );
      res.status(200).json({
        error: "success",
      });
    }
  } else {
    res.status(400).json({
      error: "You are not authorized",
    });
  }
}, "Something went wrong");
