const { catchAsync } = require("../errorHandling");
const cart = require("../models/cartModel");
exports.getUserCart = catchAsync(async (req, res, next) => {
  const cartList = await cart.find({ userID: req.params.id });
  res.status(200).json({
    error: "success",
    data: cartList,
  });
}, "An Error Occured");

exports.addUserCart = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  const productID = req.body.productID;
  const quantity = req.body.quantity;
  if (userID && productID) {
    const cartData = await cart.find({ userID: userID, productID: productID });
    if (cartData.length === 0 && quantity > 0) {
      await cart.create({
        userID: userID,
        productID: productID,
        quantity: quantity,
      });
      res.status(200).json({
        error: "success",
      });
    } else {
      res.status(400).json({
        error: "Invalid Data or Duplicate",
      });
    }
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  const productID = req.body.productID;
  if (userID && productID) {
    await cart.deleteMany({ userID: userID, productID: productID });
    res.status(200).json({ error: "success" });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
}, "Something went wrong");

exports.handleCartQuantity = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  const productID = req.body.productID;
  const quantity = req.body.quantity;
  if (userID && productID) {
    if (quantity > 0) {
      await cart.findOneAndUpdate(
        {
          userID: userID,
          productID: productID,
        },
        { quantity: quantity }
      );
      res.status(200).json({
        error: "success",
      });
    } else {
      await this.deleteCart(req, res, next);
    }
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
}, "Something went wrong");
