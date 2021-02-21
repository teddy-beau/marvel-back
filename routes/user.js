// PACKAGES IMPORT & INIT.

const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// MIDDLEWARE IMPORT
const isAuthenticated = require("../middleware/isAuthenticated");

// MODELS IMPORT
const User = require("../models/User");

// ROUTE POST: SIGN UP
router.post("/user/signup", async (req, res) => {
   try {
      // Check if user exists:
      const user = await User.findOne({ email: req.fields.email });
      console.log(user);
      if (!user) {
         // Check if all fields are provided:
         if (req.fields.username && req.fields.email && req.fields.password) {
            // Password encryption:
            const salt = uid2(64);
            const hash = SHA256(req.fields.password + salt).toString(encBase64);
            const token = uid2(64);
            // User creation:
            const newUser = new User({
               email: req.fields.email,
               username: req.fields.username,
               salt: salt,
               hash: hash,
               token: token,
            });
            // Save new user:
            await newUser.save();
            console.log(`New user created: ${newUser.email}`);
            res.status(201).json(newUser);
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

// ROUTE POST : LOG IN
router.post("/user/login", async (req, res) => {
   try {
      // Find the user with email:
      const user = await User.findOne({ email: req.fields.email });
      if (user) {
         // If the user exists, create a new hash:
         const newHash = SHA256(req.fields.password + user.salt).toString(
            encBase64
         );
         // Compare new hash with the one in the DB:
         if (newHash === user.hash) {
            console.log(`User logged in: ${user.email}`);
            res.status(200).json(user);
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

// ROUTE GET : USER LIST
router.get("/user/:userId", isAuthenticated, async (req, res) => {
   try {
      const userToFind = await User.findById(req.params.userId);
      console.log(`User found in DB`);
      res.status(200).json(userToFind);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// Export routes
module.exports = router;
