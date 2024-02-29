const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const app = express();

const productsRouter = require("./routes/marketRouter");
const indexRouter = require("./routes/indexRouter");

const port = process.env.port || 3000;

connectDb();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/market", productsRouter);
