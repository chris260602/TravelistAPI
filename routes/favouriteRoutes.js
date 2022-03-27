const express = require("express");

const {
  isAuthorizedUser,
  isAuthorizedUserFromBody,
} = require("../controllers/authController");
const {
  getFavourite,
  addFavourite,
  deleteFavourite,
} = require("../controllers/favouriteController");
const router = express.Router();

router.route("/:id").get(isAuthorizedUser, getFavourite);
router.route("/add").post(isAuthorizedUserFromBody, addFavourite);
router.route("/delete").delete(isAuthorizedUserFromBody, deleteFavourite);

module.exports = router;
