// PACKAGES IMPORT & INIT.
const express = require("express");
const axios = require("axios");
const router = express.Router();

// MIDDLEWARE IMPORT
const isAuthenticated = require("../middleware/isAuthenticated");

// MODEL IMPORT
const User = require("../models/User");

// ROUTE: SEARCH ALL CHARACTERS
router.get("/characters", async (req, res) => {
   try {
      let limit = 100;
      if (req.query.limit) {
         limit = Number(req.query.limit);
      }

      let skip = 0;
      if (req.query.skip) {
         skip = Number(req.query.skip);
      }

      let name = "";
      if (req.query.name) {
         name = req.query.name;
      }

      const response = await axios.get(
         `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}&limit=${limit}&skip=${skip}&name=${name}`
      );

      res.status(200).json(response.data);
   } catch (error) {
      console.log(error);
   }
});

// ROUTE: ADD CHARACTER TO LIST
router.post("/characters/save", isAuthenticated, async (req, res) => {
   try {
      if (req.fields.character && req.fields.userId) {
         // Find user:
         const user = await User.findById(req.fields.userId);
         // Check if the character is already saved:
         let isInList = false;
         user.fav_characters.map((elem) => {
            if (elem._id === req.fields.character._id) {
               isInList = true;
            }
         });
         // If there is no match add body to user list:
         if (!isInList) {
            user.fav_characters.push(req.fields.character);
            await user.save();
         }
         console.log(`1 character added to user list`);
         res.status(200).json(isInList);
      } else {
         res.status(400).json({
            message: "Missing information.",
         });
      }
   } catch (error) {
      console.log(error);
   }
});

// ROUTE: REMOVE CHARACTER FROM LIST
router.post("/characters/unsave", isAuthenticated, async (req, res) => {
   try {
      if (req.fields.item && req.fields.userId) {
         // Find user:
         const user = await User.findById(req.fields.userId);
         // Remove item from user list:
         user.fav_characters.map((elem, index) => {
            if (elem._id === req.fields.item._id) {
               user.fav_characters.splice(index, 1);
            }
         });
         // Save changes:
         await user.save();
         console.log(`1 character removed from user list`);
         res.status(200).json({ message: "Remove from list" });
      } else {
         res.status(400).json({
            message: "Missing information.",
         });
      }
   } catch (error) {
      console.log(error);
   }
});

// ROUTE EXPORT
module.exports = router;
