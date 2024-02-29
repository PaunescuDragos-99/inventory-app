const Category = require("../models/category");
const Product = require("../models/product");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).exec();

  res.render("categories", {
    title: "Here are all the categories",
    categories_list: allCategories,
  });
});

exports.getCategory_detail = asyncHandler(async (req, res, next) => {
  const [category, productInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }, "name summary").exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    return next(err);
  }

  res.render("category_detail", {
    title: "Category detail",
    category: category,
    productCategory: productInCategory,
  });
});

exports.createCategory_get = (req, res, next) => {
  res.render("category_form", { title: "Create a category" });
};

exports.createCategory_post = [
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });
    console.log("hereL", category);
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create a category",
        category: category,
        // errors: errors.array(),
      });
      return;
    } else {
      const categoryExist = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExist) {
        console.log("here exist", category);
        res.redirect(categoryExist.url);
      } else {
        await category.save();
        console.log("hered done", category);
        res.redirect(category.url);
      }
    }
  }),
];

exports.deleteCategory_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: delete product GET");
});

exports.deleteCategory_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: delete product POST");
});

exports.updateCategory_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: update product GET");
});

exports.updateCategory_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: update product POST");
});
