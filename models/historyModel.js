const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;
const historySchema = new mongoose.Schema({
  userID: { type: ObjectId, ref: "User", required: [true, "userID needed"] },
  productID: {
    type: ObjectId,
    ref: "Product",
    required: [true, "productID needed"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity needed"],
    default: 1,
    min: 1,
  },
  status: {
    type: Number,
    required: [true, "Status needed"],
    default: 0,
    min: 0,
  },
  purchaseDate: {
    type: Date,
    required: [true, "Date needed"],
    default: Date(Date.now()),
  },
});

const histories = mongoose.model("History", historySchema);

module.exports = histories;
