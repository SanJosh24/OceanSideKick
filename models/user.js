const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passport = require("passport");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  image: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;