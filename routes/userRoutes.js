const express = require("express");

const app = express();
const router = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
} = require("../controllers/userController");
const { userLogin } = require("../controllers/authController");

router.route("/").get(getAllUsers).post(createUser);
router.route("/getuser/:id").get(getUser);
router.route("/login").post(userLogin);
module.exports = router;
