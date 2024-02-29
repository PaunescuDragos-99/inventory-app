#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/product");
const Category = require("./models/category");

const categories = [];
const products = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategory();
  await createProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added genre: ${name}`);
}

async function productCreate(index, name, summary, price, category) {
  const productDetail = {
    name: name,
    summary: summary,
    price: price,
  };
  if (category != false) productDetail.category = category;

  const product = new Product(productDetail);
  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}

async function createCategory() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(0, "Telephone"),
    categoryCreate(1, "Gaming"),
    categoryCreate(2, "Graphic Cards"),
  ]);
}

async function createProducts() {
  console.log("Adding products");
  await Promise.all([
    productCreate(
      0,
      "Iphone X",
      "Lorem ipsum asdasdas das dasd",
      1000,
      [categories[1]]
    ),
    productCreate(
      1,
      "Samsung Galaxy S24 Ultra",
      "DASDASDAS d asd asdasd as22 dasd aas",
      1300,
      [categories[0]]
    ),
    productCreate(
      2,
      "Samsung A40",
      "dasd sad asd asdasdas ",
      600,
      [categories[0]]
    ),
    productCreate(
      3,
      "Apes and Angels",
      "dasdasdas Yes ADasdasd CRonaldo 7 <3",
      1400,
      [categories[1]]
    ),
    productCreate(
      4,
      "Playstation 5",
      "dasdsadsa dasd as2312312 dszdasdsad",
      700,
      [categories[1]]
    ),
    productCreate(
      5,
      "Test phone and gaming device",
      "Summary of test 1",
      600,
      [categories[0], categories[1]]
    ),
    productCreate(
      6,
      "Test component 2",
      "Summary of test 2",
      500,
      false
    ),
  ]);
}

