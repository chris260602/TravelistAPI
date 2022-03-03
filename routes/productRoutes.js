const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllProducts,
  createProduct,
  totalFiles,
} = require("../controllers/productController");

const { isAdmin } = require("../controllers/authController");

const app = express();
const router = express.Router();
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public", "/img"));
  },
  filename: function (req, file, cb) {
    let location =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, location);
    totalFiles.push({
      fieldname: file.fieldname,
      location: process.env.BACKEND_URL + "/public/img/" + location,
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
      { name: "mainpicture", maxCount: 1 },
      { name: "picture2", maxCount: 1 },
      { name: "picture3", maxCount: 1 },
      { name: "picture4", maxCount: 1 },
    ]),
    createProduct
  );
module.exports = router;
