const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numProducts, numCategories] = await Promise.all([
    Product.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Marketplace",
    product_count: numProducts,
    category_count: numCategories,
  });
});
exports.getProducts = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find({}, "name price")
    .sort({ name: 1 })
    .populate("category")
    .exec();

  res.render("market", {
    title: "Welcome to the market",
    product_list: allProducts,
  });
});

exports.getProduct_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();

  if (product === null) {
    const err = new Error("Product not found");
    return next(err);
  }

  res.render("product_detail", {
    title: "The product detail",
    product: product,
  });

});

exports.createProduct_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: create product GET");
});

exports.createProduct_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: create product POST");
});

exports.deleteProduct_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: delete product GET");
});

exports.deleteProduct_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: delete product POST");
});

exports.updateProduct_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: update product GET");
});

exports.updateProduct_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: update product POST");
});
