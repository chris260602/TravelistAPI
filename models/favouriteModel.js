const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;
const favouriteSchema = new mongoose.Schema({
  userID: { type: ObjectId, ref: "User" },
  productID: { type: ObjectId, ref: "Product" },
});

const favourites = mongoose.model("Favourite", favouriteSchema);

module.exports = favourites;
