const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;
const transactionSchema = new mongoose.Schema({
  userID: { type: ObjectId, ref: "User", required: [true, "userID needed"] },
  products: [
    {
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
    },
  ],
  totalItem: {
    type: Number,
    required: [true, "total Item needed"],
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: [true, "Total Price needed"],
    min: 1,
  },
  status: {
    type: Number,
    required: [true, "Status needed"],
    default: 1,
    min: 0,
  },
  purchaseDate: {
    type: Date,
    required: [true, "Date needed"],
    default: Date(Date.now()),
  },
});

const transactions = mongoose.model("Transaction", transactionSchema);
module.exports = transactions;
