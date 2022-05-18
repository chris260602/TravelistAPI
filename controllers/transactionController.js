const transaction = require("../models/transactionModel");
const users = require("../models/userModel");
const products = require("../models/productModel");
const notifications = require("../models/notificationModel");
const { catchAsync } = require("../errorHandling");
const cart = require("../models/cartModel");

const getUsableProductPictureHandler = (product) => {
  if (product.productID) {
    if (
      product.productID.mainPicture !== null &&
      !product.productID.mainPicture.includes(`${process.env.BACKEND_URL}`)
    ) {
      product.mainPicture = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.productID.mainPicture}`;
    }
    if (
      product.productID.picture2 !== null &&
      !product.productID.picture2.includes(`${process.env.BACKEND_URL}`)
    ) {
      product.picture2 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.productID.picture2}`;
    }
    if (
      product.productID.picture3 !== null &&
      !product.productID.picture3.includes(`${process.env.BACKEND_URL}`)
    ) {
      product.picture3 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.productID.picture3}`;
    }
    if (
      product.productID.picture4 !== null &&
      !product.productID.picture4.includes(`${process.env.BACKEND_URL}`)
    ) {
      product.picture4 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.productID.picture4}`;
    }
  } else {
    if (
      product.mainPicture !== null &&
      !product.mainPicture.includes(`${process.env.BACKEND_URL}`)
    ) {
      product.mainPicture = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.mainPicture}`;
    }
    if (
      product.picture2 !== null &&
      !product.picture2.includes(`${process.env.BACKEND_URL}`)
    ) {
      product.picture2 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.picture2}`;
    }
    if (
      product.picture3 !== null &&
      !product.picture3.includes(`${process.env.BACKEND_URL}`)
    ) {
      product.picture3 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.picture3}`;
    }
    if (
      product.picture4 !== null &&
      !product.picture4.includes(`${process.env.BACKEND_URL}`)
    ) {
      product.picture4 = `${process.env.BACKEND_URL}/${process.env.PRODUCT_PICTURE_URL}/${product.picture4}`;
    }
  }

  return product;
};

const getUsableProductPicture = (productList) => {
  for (let i = 0; i < productList.length; i++) {
    productList[i].products.map((product) => {
      getUsableProductPictureHandler(product.productID);
    });
  }
};

exports.getTransaction = catchAsync(async (req, res, next) => {
  let transactionList;
  if (req.query) {
    if (req.query.progress && req.query.progress === "false") {
      const transactionQuery = transaction
        .find({
          userID: req.params.id,
          status: 0,
        })
        .populate("products.productID");
      transactionList = await transactionQuery;
      getUsableProductPicture(transactionList);
    } else if (req.query.progress && req.query.progress === "true") {
      const transactionQuery = transaction
        .find({
          userID: req.params.id,
          status: 1,
        })
        .populate("products.productID");
      transactionList = await transactionQuery;
      getUsableProductPicture(transactionList);
    } else {
      const transactionQuery = transaction
        .find({ userID: req.params.id })
        .populate("products.productID");
      transactionList = await transactionQuery;
      getUsableProductPicture(transactionList);
    }
  } else {
    const transactionQuery = transaction
      .find({ userID: req.params.id })
      .populate("products.productID");
    transactionList = await transactionQuery;
    getUsableProductPicture(transactionList);
  }
  res.status(200).json({
    error: "success",
    data: transactionList,
  });
}, "An Error Occured");

exports.getProgressTransaction = catchAsync(async (req, res, next) => {
  const transactionList = await transaction.find({
    userID: req.params.id,
    status: 0,
  });
  res.status(200).json({
    error: "success",
    data: transactionList,
  });
}, "An Error Occured");

exports.getDoneTransaction = catchAsync(async (req, res, next) => {
  const transactionList = await transaction.find({
    userID: req.params.id,
    status: 1,
  });
  res.status(200).json({
    error: "success",
    data: transactionList,
  });
}, "An Error Occured");

exports.addTransaction = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  const products = req.body.products;
  const totalItem = req.body.totalItem;
  const totalPrice = req.body.totalPrice;
  if (userID && products && totalItem && totalPrice) {
    await transaction.create({
      userID: userID,
      products: products,
      totalItem: totalItem,
      totalPrice: totalPrice,
    });
    await updateProductStocks(products);
    await deleteAllCart(userID);
    await updateUserBalance(userID, totalPrice);
    await sendTransactionNotification({ userID: userID });
    res.status(200).json({
      error: "success",
    });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
}, "Something went wrong");

const deleteAllCart = async (userID) => {
  if (userID) {
    await cart.deleteMany({ userID: userID });
  }
};
const updateUserBalance = async (userID, totalPrice) => {
  if (userID && totalPrice) {
    users
      .findById(userID)
      .then((user) => {
        user.balance = user.balance - totalPrice;
        user.save();
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
const updateProductStocks = async (productsData) => {
  productsData.forEach((item) => {
    products
      .findById(item.productID)
      .then((product) => {
        product.productStocks = product.productStocks - item.quantity;
        product.productSold = product.productSold + item.quantity;
        product.save();
      })
      .catch((e) => {
        console.log(e);
      });
  });
};
const sendTransactionNotification = async (data) => {
  const finalContent = `Your Product Purchase is Successful. Our team at travelist will start to prepare and ship your order to your destination.

  Thank you for purchasing at Travelist.`;
  await notifications.create({
    userID: data.userID,
    type: "Shopping",
    title: "Product Purchase Successful",
    content: finalContent,
  });
};
exports.changeTransactionStatus = catchAsync(async (req, res, next) => {
  const transactionID = req.body.transactionID;
  const status = req.body.status;
  if (transactionID && status !== null && status !== undefined) {
    await transaction.findByIdAndUpdate(transactionID, { status: status });
    res.status(200).json({
      error: "success",
    });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  if (userID) {
    await transaction.deleteMany({ userID: userID });
    res.status(200).json({ error: "success" });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
}, "Something went wrong");
