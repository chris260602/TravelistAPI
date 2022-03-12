const fs = require("fs");
const { catchAsync } = require("../errorHandling");
const categories = require("../models/categoryModel");
exports.categoryIcon = [];
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categoryList = await categories.find();
  res.status(200).json({
    error: "success",
    data: categoryList,
  });
}, "Something went wrong");

exports.checkCategory = (category) => {
  if (
    category === "Bathroom" ||
    category === "Electronics" ||
    category === "Kitchen" ||
    category === "Clothes" ||
    category === "BeautyHealth" ||
    category === "Tools" ||
    category === "Bag" ||
    category === "Accessories" ||
    category === "FoodDrinks" ||
    category === "Bed" ||
    category === "Pest Control" ||
    category === "Games"
  ) {
    return true;
  } else {
    return false;
  }
};
const deleteIcon = (oldIcon) => {
  const filename = oldIcon.split("http://localhost:3003/public/icons/");
  fs.unlink(`public/icons/${filename[1]}`, (err) => {
    if (err) {
      console.log(`failed to delete ${filename[1]}`);
    }
  });
};
exports.createCategory = catchAsync(async (req, res, next) => {
  if (
    req.body.categoryName &&
    req.body.categoryName.length > 1 &&
    req.body.categoryValue &&
    this.checkCategory(req.body.categoryValue)
  ) {
    await categories.create({
      categoryName: req.body.categoryName,
      categoryValue: req.body.categoryValue,
      categoryIcon: this.categoryIcon[0].location,
    });

    res.status(200).json({
      error: "success",
    });
  } else {
    setTimeout(() => {
      deleteIcon(this.categoryIcon[0].location);
    }, 2500);

    res.status(400).json({
      error: "Something went wrong",
    });
  }
  setTimeout(() => {
    this.categoryIcon.splice(0, this.categoryIcon.length);
  }, 2500);
}, "Something went wrong");

exports.updateCategory = catchAsync(async (req, res, next) => {
  try {
    const userList = await categories.findById(req.params.id);

    if (
      userList !== null &&
      req.body.categoryName &&
      req.body.categoryName.length > 0 &&
      req.body.categoryValue &&
      this.checkCategory(req.body.categoryValue) &&
      this.categoryIcon.length > 0
    ) {
      deleteIcon(userList.categoryIcon);
      await categories.findByIdAndUpdate(req.params.id, {
        categoryName: req.body.categoryName,
        categoryValue: req.body.categoryValue,
        categoryIcon: this.categoryIcon[0].location,
      });
      res.status(200).json({
        error: "success",
      });
    } else {
      setTimeout(() => {
        deleteIcon(this.categoryIcon[0].location);
      }, 2000);
      res.status(400).json({
        error: "Data not found",
      });
    }
  } catch (e) {
    setTimeout(() => {
      deleteIcon(this.categoryIcon[0].location);
    }, 2000);
    res.status(400).json({
      error: "Something went wrong",
    });
  }
  setTimeout(() => {
    this.categoryIcon.splice(0, this.categoryIcon.length);
  }, 2500);
}, "Something went wrong");

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await categories.findById(req.params.id);
  if (category !== null) {
    deleteIcon(category.categoryIcon);
    await categories.findByIdAndDelete(req.params.id);
    res.status(200).json({
      error: "success",
    });
  } else {
    res.status(400).json({
      error: "Data not found",
    });
  }
}, "Something went wrong");
