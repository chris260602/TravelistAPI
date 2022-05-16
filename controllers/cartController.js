const { catchAsync } = require("../errorHandling");
const cart = require("../models/cartModel");

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

exports.getUserCart = catchAsync(async (req, res, next) => {
  const cartList = await cart
    .find({ userID: req.params.id })
    .populate("productID");
  getUsableProductPicture(cartList);
  res.status(200).json({
    error: "success",
    data: cartList,
  });
}, "An Error Occured");

exports.getSingleCartData = catchAsync(async (req, res, next) => {
  const cartData = await cart.findOne({
    userID: req.params.userID,
    productID: req.params.productID,
  });
  res.status(200).json({
    error: "success",
    data: cartData,
  });
}, "An Error Occured");

exports.addUserCart = catchAsync(async (req, res, next) => {
  const userID = req.body.userID;
  const productID = req.body.productID;
  const quantity = req.body.quantity;
  if (userID && productID) {
    const cartData = await cart.findOne({
      userID: userID,
      productID: productID,
    });
    if (!cartData && quantity > 0) {
      await cart.create({
        userID: userID,
        productID: productID,
        quantity: quantity,
      });
      res.status(200).json({
        error: "success",
      });
    } else {
      await cart.findOneAndUpdate(
        {
          userID: userID,
          productID: productID,
        },
        {
          quantity: cartData.quantity + quantity,
        }
      );
      res.status(200).json({
        error: "success",
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
