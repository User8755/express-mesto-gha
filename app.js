const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "642da7678da1aacc2ff5c18e",
  };

  next();
});

app.use("/user", require("./routes/users"));
app.use("/card", require("./routes/cards"));

app.listen(PORT, () => {
  console.log("Сервер запущен");
});
