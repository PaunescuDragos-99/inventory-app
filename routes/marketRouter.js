const express = require("express");
const router = express.Router();
const product_controller = require("../controllers/productController");
const category_controller = require("../controllers/categoryController");

//GET HOME PAGE
router.get("/", product_controller.index);

//PRODUCTS ROUTES
router.get("/products", product_controller.getProducts);
router.get("/product/:id", product_controller.getProduct_detail);
router.get("/product/create", product_controller.createProduct_get);
router.post("/product/create", product_controller.createProduct_post);
router.get("/product/:id/delete", product_controller.deleteProduct_get);
router.post("/product/:id/delete", product_controller.deleteProduct_get);
router.get("/product/:id/update", product_controller.updateProduct_get);
router.post("/product/:id/update", product_controller.updateProduct_get);

//CATEGORY ROUTES
router.get("/categories", category_controller.getCategories);
router.get("/category/create", category_controller.createCategory_get);
router.post("/category/create", category_controller.createCategory_post);
router.get("/category/:id", category_controller.getCategory_detail);
router.get("/category/:id/delete", category_controller.deleteCategory_get);
router.post("/category/:id/delete", category_controller.deleteCategory_post);
router.get("/category/:id/update", category_controller.updateCategory_get);
router.post("/category/:id/update", category_controller.updateCategory_post);

module.exports = router;
