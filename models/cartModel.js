const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema({
  userID: { type: ObjectId, ref: "User" },
  productID: { type: ObjectId, ref: "Product" },
  quantity: { type: Number, required: [true, "Must Have Quantity"], min: 1 },
});

const carts = mongoose.model("Cart", cartSchema);

module.exports = carts;
