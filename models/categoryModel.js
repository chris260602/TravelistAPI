const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: [true, "Category name required"] },
  categoryValue: {
    type: String,
    required: [true, "Category value required"],
    // enum: [
    //   "Bathroom",
    //   "Electronics",
    //   "Kitchen",
    //   "Clothes",
    //   "BeautyHealth",
    //   "Tools",
    //   "Bag",
    //   "Accessories",
    //   "FoodDrinks",
    //   "Bed",
    //   "Pest Control",
    //   "Games",
    // ],
    unique: [true, "No Duplicate!"],
  },
  categoryIcon: { type: String, required: [true, "Category icon required"] },
});
const categories = mongoose.model("Categorie", categorySchema);
module.exports = categories;
