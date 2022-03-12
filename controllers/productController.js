const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const bcrypt = require("bcrypt");
const { catchAsync } = require("../errorHandling");
const { checkJWTCookie, getJWTUser } = require("./cookieController");
const { checkCategory } = require("./categoryController");
const products = require("../models/productModel");
exports.totalFiles = [];
exports.getAllProducts = catchAsync(async (req, res, next) => {
  checkJWTCookie(req, res);
  const productList = await products.find();
  res.status(200).json({
    error: "success",
    data: productList,
  });
}, "Something went wrong");

exports.getProduct = catchAsync(async (req, res, next) => {
  checkJWTCookie(req, res);
  const product = await products.findById(req.params.id);
  if (product !== null) {
    res.status(200).json({
      error: "success",
      data: product,
    });
  } else {
    res.status(400).json({
      error: "No data available",
    });
  }
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
  let mainPicture = this.totalFiles.filter(
    (picture) => picture.fieldname === "mainPicture"
  );
  if (mainPicture.length === 0) {
    mainPicture = null;
  } else {
    mainPicture = mainPicture[0].location;
  }
  newPicture.push(mainPicture);
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

exports.createProduct = catchAsync(async (req, res, next) => {
  const user = getJWTUser(req, res);
  if (user.length > 0) {
    if (user[1] === 1) {
      const pictures = getPicture();
      if (
        req.body.productName &&
        req.body.productPrice &&
        req.body.productPrice >= 0 &&
        req.body.productStocks &&
        req.body.productStocks >= 0 &&
        req.body.categoryValue &&
        checkCategory(req.body.categoryValue) &&
        req.body.productContent &&
        pictures[0] !== null
      ) {
        try {
          const product = await products.create({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productSold: 0,
            productStocks: req.body.productStocks,
            productContent: req.body.productContent,
            categoryValue: req.body.categoryValue,
            mainPicture: pictures[0],
            picture2: pictures[1],
            picture3: pictures[2],
            picture4: pictures[3],
          });
          res.status(200).json({
            error: "success",
            data: product,
          });
        } catch (e) {
          setTimeout(() => {
            deletePicture();
          }, 2500);
          res.status(400).json({
            error: "Something went wrong",
          });
        }
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
    filename = rows.mainPicture.split("http://localhost:3003/public/img/");
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
    const product = await products.findById(
      productid,
      "mainPicture picture2 picture3 picture4"
    );

    if (newPicture[0] !== null) {
      if (product.mainPicture !== null) {
        deleteOldPictureHelper(product, 1);
      }
      await products.findByIdAndUpdate(productid, {
        mainPicture: newPicture[0],
      });
    }
    if (newPicture[1] !== null || product.picture2 !== null) {
      if (newPicture[1] !== null && product.picture2 === null) {
        await products.findByIdAndUpdate(productid, {
          picture2: newPicture[1],
        });
      } else if (
        (product.picture2 !== null && pictureqty < 2) ||
        newPicture[1] !== null
      ) {
        deleteOldPictureHelper(product, 2);
        await products.findByIdAndUpdate(productid, {
          picture2: newPicture[1],
        });
      }
    }
    if (newPicture[2] !== null || product.picture3 !== null) {
      if (newPicture[2] !== null && product.picture3 === null) {
        await products.findByIdAndUpdate(productid, {
          picture3: newPicture[2],
        });
      } else if (
        (product.picture3 !== null && pictureqty < 3) ||
        newPicture[2] !== null
      ) {
        deleteOldPictureHelper(product, 3);
        await products.findByIdAndUpdate(productid, {
          picture3: newPicture[2],
        });
      }
    }
    if (newPicture[3] !== null || product.picture4 !== null) {
      if (newPicture[3] !== null && product.picture4 === null) {
        await products.findByIdAndUpdate(productid, {
          picture4: newPicture[3],
        });
      } else if (
        (product.picture4 !== null && pictureqty < 4) ||
        newPicture[3] !== null
      ) {
        deleteOldPictureHelper(product, 4);
        await products.findByIdAndUpdate(productid, {
          picture4: newPicture[3],
        });
      }
    }
  },
  "Something went wrong"
);

exports.updateProduct = catchAsync(async (req, res, next) => {
  const user = getJWTUser(req, res);
  if (user.length > 0) {
    if (user[1] === 1) {
      const pictures = getPicture();
      if (
        req.body.productName &&
        req.body.productPrice &&
        req.body.productPrice >= 0 &&
        req.body.productStocks &&
        req.body.productStocks >= 0 &&
        req.body.categoryValue &&
        req.body.pictureqty &&
        checkCategory(req.body.categoryValue) &&
        req.body.productContent
      ) {
        changeOldPicture(pictures, req.params.id, req.body.pictureqty);
        await products.findByIdAndUpdate(req.params.id, {
          productName: req.body.productName,
          productPrice: req.body.productPrice,
          productStocks: req.body.productStocks,
          categoryValue: req.body.categoryValue,
          productContent: req.body.productContent,
        });
        const product = await products.findByIdAndUpdate(req.params.id, {
          productName: req.body.productName,
          productPrice: req.body.productPrice,
          productStocks: req.body.productStocks,
          categoryValue: req.body.categoryValue,
          productContent: req.body.productContent,
        });
        res.status(200).json({
          error: "success",
          data: product,
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
  const user = getJWTUser(req, res);
  if (user.length > 0) {
    if (user[1] === 1) {
      const product = await products.findById(
        req.params.id,
        "mainPicture picture2 picture3 picture4"
      );
      if (product.mainPicture !== null) {
        deleteOldPictureHelper(product, 1);
      }
      if (product.picture2 !== null) {
        deleteOldPictureHelper(product, 2);
      }
      if (product.picture3 !== null) {
        deleteOldPictureHelper(product, 3);
      }
      if (product.picture4 !== null) {
        deleteOldPictureHelper(product, 4);
      }
      await products.findByIdAndDelete(req.params.id);
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
