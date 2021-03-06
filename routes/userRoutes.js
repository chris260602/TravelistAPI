const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  changeProfilePic,
  newPicture,
  deleteUser,
  activeUser,
  changeUserPassword,
  changeUserName,
  changeUserEmail,
  checkUserSessionExpired,
  forgetUserPassword,
  validateForgetPasswordCode,
} = require("../controllers/userController");
const {
  userLogin,
  isAuthorizedUser,
} = require("../controllers/authController");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public", "/img/profile"));
  },
  filename: function (req, file, cb) {
    let location =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, location);
    newPicture.push({
      fieldname: file.fieldname,
      location: location,
    });
  },
});
const upload = multer({
  storage: diskStorage,
});

router.route("/").get(getAllUsers).post(createUser);
router.route("/verifysession").get(checkUserSessionExpired);
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
router.route("/changeusername").patch(changeUserName);
router.route("/changeuserpassword").patch(changeUserPassword);
router.route("/changeuseremail").patch(changeUserEmail);
router.route("/forgetpassword").patch(forgetUserPassword);
router
  .route("/validateforgetpasswordcode/:code")
  .get(validateForgetPasswordCode);
router.route("/activate/:id").post(activeUser);
module.exports = router;
