const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

//Adding middlerware to express app
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Config Keys
const db = require("./config/keys").mongoURI;

//Connect to MongoDB using Mongoose
mongoose
  .connect(db, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err, "Error"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Running server on Port ${PORT}`));