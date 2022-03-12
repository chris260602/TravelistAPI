const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userID: { type: ObjectId, ref: "User" },
  productID: { type: ObjectId, ref: "Product" },
  quantity: { type: Number, required, min: 1 },
});

const carts = mongoose.model("Cart", cartSchema);

module.exports = carts;
