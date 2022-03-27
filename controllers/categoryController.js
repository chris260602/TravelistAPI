const fs = require("fs");
const { catchAsync } = require("../errorHandling");
const categories = require("../models/categoryModel");
exports.categoryIcon = [];

const getUsableCategoryPictureHandler = (category) => {
  if (category.categoryIcon) {
    category.categoryIcon = `${process.env.BACKEND_URL}/${process.env.CATEGORY_PICTURE_URL}/${category.categoryIcon}`;
  }
  return category;
};

const getUsableCategoryPicture = (categoryList) => {
  let finalCategory;
  if (categoryList === null) {
    return [];
  }
  if (!categoryList.length) {
    finalCategory = getUsableCategoryPictureHandler(categoryList);
  } else {
    finalCategory = categoryList.map((category) =>
      getUsableCategoryPictureHandler(category)
    );
  }
  return finalCategory;
};

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categoryList = await categories.find();
  const finalCategory = getUsableCategoryPicture(categoryList);
  res.status(200).json({
    error: "success",
    data: finalCategory,
  });
}, "Something went wrong");

// exports.checkCategory = (category) => {
//   if (
//     category === "Bathroom" ||
//     category === "Electronics" ||
//     category === "Kitchen" ||
//     category === "Clothes" ||
//     category === "BeautyHealth" ||
//     category === "Tools" ||
//     category === "Bag" ||
//     category === "Accessories" ||
//     category === "FoodDrinks" ||
//     category === "Bed" ||
//     category === "Pest Control" ||
//     category === "Games"
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };
const deleteIcon = (oldIcon) => {
  fs.unlink(`${process.env.CATEGORY_PICTURE_URL}/${oldIcon}`, (err) => {
    if (err) {
      console.log(`failed to delete ${oldIcon}`);
    }
  });
};
exports.createCategory = catchAsync(async (req, res, next) => {
  if (
    req.body.categoryName &&
    req.body.categoryName.length > 1 &&
    req.body.categoryValue
    // &&
    // this.checkCategory(req.body.categoryValue)
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
    const categoryList = await categories.findById(req.params.id);

    if (
      categoryList !== null &&
      req.body.categoryName &&
      req.body.categoryName.length > 0 &&
      req.body.categoryValue &&
      this.checkCategory(req.body.categoryValue) &&
      this.categoryIcon.length > 0
    ) {
      deleteIcon(categoryList.categoryIcon);
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
