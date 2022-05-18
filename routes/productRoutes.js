const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllProducts,
  getProduct,
  createProduct,
  totalFiles,
  updateProduct,
  deleteProduct,
  getPopularProducts,
  getFilteredProducts,
} = require("../controllers/productController");

const { isAdmin } = require("../controllers/authController");

const router = express.Router();
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public", "/img/products"));
  },
  filename: function (req, file, cb) {
    let location =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, location);
    totalFiles.push({
      fieldname: file.fieldname,
      location: location,
    });
  },
});
const upload = multer({
  storage: diskStorage,
});

router
  .route("/")
  .get(getAllProducts)
  .post(
    isAdmin,
    upload.fields([
      { name: "mainPicture", maxCount: 1 },
      { name: "picture2", maxCount: 1 },
      { name: "picture3", maxCount: 1 },
      { name: "picture4", maxCount: 1 },
    ]),
    createProduct
  );
router.route("/filter").get(getFilteredProducts);
router.route("/popular").get(getPopularProducts);
router.route("/:id").get(getProduct);

router.route("/updateproduct/:id").patch(
  isAdmin,
  upload.fields([
    { name: "mainPicture", maxCount: 1 },
    { name: "picture2", maxCount: 1 },
    { name: "picture3", maxCount: 1 },
    { name: "picture4", maxCount: 1 },
  ]),
  updateProduct
);

router.route("/deleteproduct/:id").delete(isAdmin, deleteProduct);
module.exports = router;
