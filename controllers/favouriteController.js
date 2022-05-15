const favourite = require("../models/favouriteModel");
const { catchAsync } = require("../errorHandling");

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

  finalProduct = productList.map((product) =>
    getUsableProductPictureHandler(product.productID)
  );

  return finalProduct;
};

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
exports.getSingleFavourite = catchAsync(async (req, res, next) => {
  const userID = req.params.userID;
  const productID = req.params.productID;
  if (userID && productID) {
    const singleData = await favourite.findOne({
      userID: userID,
      productID: productID,
    });
    res.status(200).json({ data: singleData, error: "success" });
  } else {
    res.status(400).json({
      error: "Invalid Data",
    });
  }
}, "Something went wrong");
exports.getProductFromFavourite = catchAsync(async (req, res, next) => {
  const favouriteList = await favourite
    .find({ userID: req.params.id })
    .populate("productID");

  getUsableProductPicture(favouriteList);
  res.status(200).json({ data: favouriteList, error: "success" });
}, "Something went wrong");
