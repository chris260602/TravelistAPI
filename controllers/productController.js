const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const bcrypt = require("bcrypt");
const { catchAsync } = require("../errorHandling");
const { checkJWTCookie, getJWTUser } = require("./cookieController");
const products = require("../models/productModel");
const categories = require("../models/categoryModel");
exports.totalFiles = [];

const getUsableProductPictureHandler = (product) => {
  if (product.mainPicture !== null) {
    product.mainPicture = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.mainPicture}`;
  }
  if (product.picture2 !== null) {
    product.picture2 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.picture2}`;
  }
  if (product.picture3 !== null) {
    product.picture3 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.picture3}`;
  }
  if (product.picture4 !== null) {
    product.picture4 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.picture4}`;
  }
  return product;
};

const getUsableProductPicture = (productList) => {
  let finalProduct;
  if (productList === null) {
    return [];
  }
  if (!productList.length) {
    finalProduct = getUsableProductPictureHandler(productList);
  } else {
    finalProduct = productList.map((product) =>
      getUsableProductPictureHandler(product)
    );
  }
  return finalProduct;
};

const isCategoriesValueValid = async (testedValue) => {
  const categoryList = await categories.find({ categoryValue: testedValue });
  if (categoryList.length > 0) {
    return true;
  } else {
    return false;
  }
};
exports.getAllProducts = catchAsync(async (req, res, next) => {
  checkJWTCookie(req, res);
  const productList = await products.find();
  const finalProduct = getUsableProductPicture(productList);
  res.status(200).json({
    error: "success",
    data: finalProduct,
  });
}, "Something went wrong");

exports.getProduct = catchAsync(async (req, res, next) => {
  checkJWTCookie(req, res);
  const product = await products.findById(req.params.id);
  const finalProduct = getUsableProductPicture(product);
  if (product !== null) {
    res.status(200).json({
      error: "success",
      data: finalProduct,
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
      fs.unlink(
        `${process.env.PRODUCT_PICTURE_URL}/${this.totalFiles[i].location}`,
        (err) => {
          if (err) {
            console.log(`failed to delete ${this.totalFiles[i].location}`);
          }
        }
      );
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
        req.body.productContent &&
        pictures[0] !== null
      ) {
        const isValid = await isCategoriesValueValid(req.body.categoryValue);
        if (isValid) {
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
            error: "Invalid Category Value",
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
    filename = rows.mainPicture;
  } else if (target === 2) {
    filename = rows.picture2;
  } else if (target === 3) {
    filename = rows.picture3;
  } else if (target === 4) {
    filename = rows.picture4;
  }
  fs.unlink(`${process.env.PRODUCT_PICTURE_URL}/${filename}`, (err) => {
    if (err) {
      console.log(`failed to delete ${filename}`);
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
        req.body.productContent
      ) {
        const isValid = await isCategoriesValueValid(req.body.categoryValue);
        if (isValid) {
          changeOldPicture(pictures, req.params.id, req.body.pictureqty);

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

exports.getPopularProducts = catchAsync(async (req, res, next) => {
  const productList = await products
    .find()
    .sort("-productSold")
    .limit(3)
    .exec();
  if (productList.length > 0) {
    const finalData = getUsableProductPicture(productList);
    res.status(200).json({
      data: finalData,
      error: "success",
    });
  } else {
    res.status(400).json({
      error: "No Data",
    });
  }
}, "Something went wrong");
