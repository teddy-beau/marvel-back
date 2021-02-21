// PACKAGE IMPORT
const mongoose = require("mongoose");

// DB MODEL
const User = mongoose.model("User", {
   email: {
      unique: true,
      required: true,
      type: String,
   },
   username: String,
   fav_characters: Array,
   fav_comics: Array,
   token: String,
   hash: String,
   salt: String,
});

// MODEL EXPORT
module.exports = User;
