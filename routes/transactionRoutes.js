const express = require("express");

const { isAuthorizedUserFromBody } = require("../controllers/authController");
const {
  getTransaction,
  addTransaction,
  changeTransactionStatus,
  deleteTransaction,
} = require("../controllers/transactionController");
const router = express.Router();
router.route("/:id").get(getTransaction);
router.route("/add").post(isAuthorizedUserFromBody, addTransaction);
router
  .route("/changestatus")
  .patch(isAuthorizedUserFromBody, changeTransactionStatus);
router.route("/delete").delete(isAuthorizedUserFromBody, deleteTransaction);

module.exports = router;
