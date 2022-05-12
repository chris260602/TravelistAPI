const express = require("express");
const {
  getAllTopUpRequest,
  createTopUpRequest,
  declineTopUpRequest,
  acceptTopUpRequest,
} = require("../controllers/topUpController");

const router = express.Router();

router
  .route("/")
  .get(getAllTopUpRequest)
  .post(createTopUpRequest)
  .delete(declineTopUpRequest)
  .patch(acceptTopUpRequest);
module.exports = router;
