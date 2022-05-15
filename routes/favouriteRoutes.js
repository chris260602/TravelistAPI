const express = require("express");

const {
  isAuthorizedUser,
  isAuthorizedUserFromBody,
} = require("../controllers/authController");
const {
  getFavourite,
  addFavourite,
  deleteFavourite,
  getSingleFavourite,
  getProductFromFavourite,
} = require("../controllers/favouriteController");
const router = express.Router();
router.route("/getspecific/:userID/:productID").get(getSingleFavourite);
router.route("/getUserProducts/:id").get(getProductFromFavourite);
router.route("/:id").get(isAuthorizedUser, getFavourite);
router.route("/add").post(isAuthorizedUserFromBody, addFavourite);
router.route("/delete").delete(isAuthorizedUserFromBody, deleteFavourite);

module.exports = router;
