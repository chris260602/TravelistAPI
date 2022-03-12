const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "You need a product name"],
    minlength: 1,
  },
  productPrice: {
    type: Number,
    required: [true, "You need a product price"],
    min: 0,
    default: 0,
  },
  productSold: {
    type: Number,
    required: [true, "You need a product sold"],
    min: 0,
    default: 0,
  },
  productStocks: {
    type: Number,
    required: [true, "You need a product stocks"],
    min: 1,
    default: 1,
  },
  productContent: {
    type: String,
    required: [true, "You need a product content"],
    minlength: 1,
  },
  mainPicture: {
    type: String,
    required: [true, "You need a main picture"],
    default: `${process.env.DEFAULT_PROFILE_PICTURE}`,
  },
  picture2: { type: String, default: null },
  picture3: { type: String, default: null },
  picture4: { type: String, default: null },
  categoryValue: { type: String, required: [true, "Category required"] },
});

const products = mongoose.model("Product", productSchema);

module.exports = products;
