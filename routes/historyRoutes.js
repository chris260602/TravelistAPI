const express = require("express");

const {
  isAuthorizedUser,
  isAuthorizedUserFromBody,
} = require("../controllers/authController");
const {
  getHistory,
  addHistory,
  changeHistoryStatus,
  deleteHistory,
} = require("../controllers/historyController");
const router = express.Router();

router.route("/:id").get(isAuthorizedUser, getHistory);
router.route("/add").post(isAuthorizedUserFromBody, addHistory);
router
  .route("/changestatus")
  .patch(isAuthorizedUserFromBody, changeHistoryStatus);
router.route("/delete").delete(isAuthorizedUserFromBody, deleteHistory);

module.exports = router;
