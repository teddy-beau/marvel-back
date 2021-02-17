// PACKAGE IMPORT
const mongoose = require("mongoose");

// DB MODEL
const User = mongoose.model("User", {
   email: {
      unique: true,
      required: true,
      type: String,
   },
   fav_characters: Array,
   fav_comics: Array,
   token: String,
   hash: String,
   salt: String,
});

// Export model
module.exports = User;