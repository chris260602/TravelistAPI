const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const router = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  changeProfilePic,
  newPicture,
  deleteUser,
} = require("../controllers/userController");
const {
  userLogin,
  isAuthorizedUser,
} = require("../controllers/authController");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public", "/img"));
  },
  filename: function (req, file, cb) {
    let location =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, location);
    newPicture.push({
      fieldname: file.fieldname,
      location: process.env.BACKEND_URL + "/public/img/" + location,
    });
  },
});
const upload = multer({
  storage: diskStorage,
});

router.route("/").get(getAllUsers).post(createUser);
router.route("/getuser/:id").get(getUser);
router.route("/login").post(userLogin);
router
  .route("/changepicture/:id")
  .patch(
    isAuthorizedUser,
    upload.fields([{ name: "profilePicture", maxCount: 1 }]),
    changeProfilePic
  );
router.route("/deleteuser/:id").delete(isAuthorizedUser, deleteUser);
module.exports = router;
