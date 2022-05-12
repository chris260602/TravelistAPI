const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;
const topUpSchema = new mongoose.Schema({
  userID: {
    type: ObjectId,
    ref: "User",
    required: [true, "Must Include User ID"],
  },
  userName: {
    type: String,
    required: [true, "Must Include User Name"],
  },
  requestAmount: {
    type: Number,
    min: [0, "Invalid Amount"],
    required: [true, "Must Include Amount"],
  },
});

const topups = mongoose.model("TopUp", topUpSchema);
module.exports = topups;
