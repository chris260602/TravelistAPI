const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  categoryIcon,
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  isAdmin,
  isCategoryDataFound,
} = require("../controllers/authController");
const app = express();
const router = express.Router();
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public", "/icons/category"));
  },
  filename: function (req, file, cb) {
    let location =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, location);
    categoryIcon.push({
      fieldname: file.fieldname,
      location: location,
    });
  },
});
const upload = multer({
  storage: diskStorage,
});
router.route("/").get(getAllCategories);
router.route("/:id").get(getCategory);
router
  .route("/create")
  .post(
    isAdmin,
    upload.fields([{ name: "categoryIcon", maxCount: 1 }]),
    createCategory
  );
router
  .route("/update/:id")
  .patch(
    isAdmin,
    isCategoryDataFound,
    upload.fields([{ name: "categoryIcon", maxCount: 1 }]),
    updateCategory
  );

router.route("/delete/:id").delete(isAdmin, deleteCategory);
module.exports = router;
