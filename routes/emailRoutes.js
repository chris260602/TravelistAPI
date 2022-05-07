const express = require("express");

const {
  isAuthorizedUser,
  isAuthorizedUserFromBody,
} = require("../controllers/authController");
const { sendEmail } = require("../controllers/emailController");
const { verifyAccount } = require("../controllers/userController");
const router = express.Router();

router.route("/").get((req, res) => {
  sendEmail({
    subject: "Test",
    text: "I am sending an email from travelist!",
    to: "christoperlim20@gmail.com",
    from: process.env.EMAIL,
  }).catch((e) => console.log(e));

  res.send("HI");
});
router.route("/verifyaccount/:code").get(verifyAccount);
// router.route("/create").post(isAuthorizedUserFromBody, addUserCart);
// router.route("/handleqty").patch(isAuthorizedUserFromBody, handleCartQuantity);
// router.route("/delete").delete(isAuthorizedUserFromBody, deleteCart);

module.exports = router;
