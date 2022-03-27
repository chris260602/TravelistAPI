const favourite = require("../models/favouriteModel");
const { catchAsync } = require("../errorHandling");

exports.getFavourite = catchAsync(async (req, res, next) => {
  const favouriteList = await favourite.find({ userID: req.params.id });
  res.status(200).json({
    error: "success",
    data: favouriteList,
  });
}, "An Error Occured");

exports.addFavourite = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  const productID = req.body.productID;
  if (userID && productID) {
    const favouriteData = await favourite.find({
      userID: userID,
      productID: productID,
    });
    if (favouriteData.length === 0) {
      await favourite.create({
        userID: userID,
        productID: productID,
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
}, "Something went wrong");

exports.deleteFavourite = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  const productID = req.body.productID;
  if (userID && productID) {
    await favourite.deleteMany({ userID: userID, productID: productID });
    res.status(200).json({ error: "success" });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
}, "Something went wrong");
