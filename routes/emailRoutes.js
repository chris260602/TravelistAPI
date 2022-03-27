const express = require("express");

const {
  isAuthorizedUser,
  isAuthorizedUserFromBody,
} = require("../controllers/authController");
const {} = require("../controllers/emailController");
const router = express.Router();

// router.route("/:id").get(isAuthorizedUser, getUserCart);
// router.route("/create").post(isAuthorizedUserFromBody, addUserCart);
// router.route("/handleqty").patch(isAuthorizedUserFromBody, handleCartQuantity);
// router.route("/delete").delete(isAuthorizedUserFromBody, deleteCart);

module.exports = router;
