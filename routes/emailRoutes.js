const express = require("express");

const { verifyAccount } = require("../controllers/userController");
const router = express.Router();

router.route("/verifyaccount/:code").get(verifyAccount);

module.exports = router;
