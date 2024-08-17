require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = mongoose.Schema({
  username: String,
});

const exerciseSchema = mongoose.Schema({
  userId: mongoose.ObjectId,
  description: String,
  duration: Number,
  date: String,
});

module.exports = {
  userModel: mongoose.model("userSchema", userSchema),
  exerciseModel: mongoose.model("exerciseSchema", exerciseSchema),
};
