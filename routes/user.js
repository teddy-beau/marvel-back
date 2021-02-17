// PACKAGES IMPORT & INIT.

const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// MODELS IMPORT
const User = require("../models/User");

// ROUTE POST: SIGN UP
router.post("/user/signup", async (req, res) => {
   try {
      // Checking user existence
      const user = await User.findOne({ email: req.fields.email });
      // console.log(user);

      if (!user) {
         // Checking all fields are provided
         if (req.fields.email && req.fields.password) {
            // Password encryption
            const salt = uid2(64);
            const hash = SHA256(req.fields.password + salt).toString(encBase64);
            const token = uid2(64);
            // console.log(salt);
            // console.log(hash);
            // console.log("token", token);

            // User creation
            const newUser = new User({
               email: req.fields.email,
               salt: salt,
               hash: hash,
               token: token,
            });

            await newUser.save();
            console.log("New user created", newUser);

            res.status(201).json({
               _id: newUser._id,
               email: newUser.email,
               token: newUser.token,
            });
         } else {
            res.status(400).json({
               message: "Email and password are required.",
            });
         }
      } else {
         res.status(400).json({
            message: "An account already exists for this email.",
         });
      }
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// Route POST : LOG IN
router.post("/user/login", async (req, res) => {
   try {
      // Find the user with email
      const user = await User.findOne({ email: req.fields.email });
      if (user) {
         // If user exists, create a new hash
         const newHash = SHA256(req.fields.password + user.salt).toString(
            encBase64
         );
         // Compare new hash with the one in the DB
         if (newHash === user.hash) {
            res.status(200).json({
               _id: user._id,
               token: user.token,
            });
         } else {
            res.status(400).json({
               message: "Incorrect email or password.",
            });
         }
      } else {
         res.status(400).json({
            message: "Incorrect email or password.",
         });
      }
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});
// Export routes
module.exports = router;
