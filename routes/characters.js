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
         // name = new RegExp(req.query.name, "i"); // Not accepted by API
         name = req.query.name;
      }

      const response = await axios.get(
         `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}&limit=${limit}&skip=${skip}&name=${name}`
      );
      // Cleaning the API call results by removing charcaters without picture
      for (let i = 0; i < response.data.results.length; i++) {
         if (
            !response.data.results[i].thumbnail ||
            response.data.results[i].thumbnail.path ===
               "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
         ) {
            response.data.results.splice(i, 1);
         }
      }
      res.status(200).json(response.data);
   } catch (error) {
      console.log(error);
   }
});

// ADD CHARACTER TO LIST
router.post("/characters/save", isAuthenticated, async (req, res) => {
   try {
      // Make sure both infos are available
      if (req.query.character && req.query.userId) {
         // Find user
         const user = await User.findById(req.query.userId);
         // // Get comic info:
         // const response = await axios.get(
         //    `https://lereacteur-marvel-api.herokuapp.com/characters/${req.query.comicId}?apiKey=${process.env.MARVEL_API_KEY}`
         // );
         // Get request data:

         // Add to user list:
         user.fav_characters.push({ character: req.query.character });
         await user.save();
         console.log(user);
      } else {
         res.status(400).json({
            message: "Missing information.",
         });
      }
   } catch (error) {
      console.log(error);
   }
});

// REMOVE CHARACTER FROM LIST
router.post("/characters/unsave", isAuthenticated, async (req, res) => {
   try {
      // Make sure both infos are available
      if (req.query.character && req.query.userId) {
         // Find user
         const user = await User.findById(req.query.userId);
         // loop fav to find match
         // remove match (splice)

         // Add to user list:
         user.fav_characters.push({ character: req.query.character });
         await user.save();
         console.log(user);
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
