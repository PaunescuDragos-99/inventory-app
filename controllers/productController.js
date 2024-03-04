const Category = require("../models/category");
const Product = require("../models/product");
const { body, validationResult } = require("express-validator");

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
  const allCategory = await Category.find().sort({ name: 1 }).exec();

  res.render("product_form", {
    title: "create",
    category: allCategory,
  });
});

exports.createProduct_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      summary: req.body.summary,
      price: req.body.price,
      category: req.body.category,
    });
    if (!errors.isEmpty()) {
      const allCategory = await Category.find().sort({ name: 1 }).exec();
      console.log("hello:", allCategory);
      for (let category of allCategory) {
        if (product.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("product_form", {
        title: "create",
        product: product,
        category: allCategory,
      });
    } else {
      await product.save();
      res.redirect(product.url);
    }
  }),
];

exports.deleteProduct_get = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();

  if (product === null) {
    res.redirect("/market/products");
  }

  res.render("product_delete", { title: "Delete product", product: product });
});

exports.deleteProduct_post = asyncHandler(async (req, res, next) => {
  await Product.findByIdAndDelete(req.body.productid).exec();
  res.redirect("/market/products");
});

exports.updateProduct_get = asyncHandler(async (req, res, next) => {
  const [product, allCategories] = await Promise.all([
    Product.findById(req.params.id).populate("category").exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (product === null) {
    res.redirect("/market/products");
  }

  allCategories.forEach((item) => {
    if (product.category.includes(item._id)) item.checked = "true";
  });

  res.render("product_form", {
    title: "update",
    product: product,
    category: allCategories,
  });
});

exports.updateProduct_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("summary", "summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      summary: req.body.summary,
      price: req.body.price,
      category:
        typeof req.body.category === "undefined" ? [] : req.body.category,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().sort({ name: 1 }).exec();
      for (let category of allCategories) {
        if (product.category.indexOf(category._id) > -1) {
          category.checked = "true";
        }
      }
      res.render("product_form", {
        title: "update",
        product: product,
        category: allCategories,
      });
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            summary: req.body.summary,
            price: req.body.price,
            category: req.body.category,
          },
        },
        { new: true }
      );
      res.redirect(updatedProduct.url);
    }
  }),
];
