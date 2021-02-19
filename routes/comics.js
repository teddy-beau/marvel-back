// PACKAGES IMPORT & INIT.
const express = require("express");
const axios = require("axios");
const router = express.Router();

// MIDDLEWARE IMPORT
const isAuthenticated = require("../middleware/isAuthenticated");

// MODEL IMPORT
const User = require("../models/User");

// ROUTE: SEARCH ALL COMICS
router.get("/comics", async (req, res) => {
   try {
      let limit = 100;
      if (req.query.limit) {
         limit = Number(req.query.limit);
      }

      let skip = 0;
      if (req.query.skip) {
         skip = Number(req.query.skip);
      }

      let title = "";
      if (req.query.title) {
         // name = new RegExp(req.query.title, "i"); // Not accepted by API
         title = req.query.title;
      }

      const response = await axios.get(
         `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}&limit=${limit}&skip=${skip}&title=${title}`
      );
      // console.log(response.data);
      res.status(200).json(response.data);
   } catch (error) {
      console.log(error);
   }
});

// ROUTE: COMICS FOR 1 CHARACTER
router.get("/comics/:characterId", async (req, res) => {
   try {
      let characterId = req.params.characterId;

      const response = await axios.get(
         `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
      );
      // console.log(response.data);
      res.status(200).json(response.data);
   } catch (error) {
      console.log(error);
   }
});

// ADD COMIC TO LIST
// router.post("/comics/save", isAuthenticated, async (req, res) => {
//    try {
//       // Make sure both infos are available
//       if (req.query.comicId && req.query.userId) {
//          // Find user
//          const user = await User.findById(req.query.userId);
//          // Get comic info:
//          const response = await axios.get(
//             `https://lereacteur-marvel-api.herokuapp.com/comics/${req.query.comicId}?apiKey=${process.env.MARVEL_API_KEY}`
//          );
//          // Add to user list:
//          user.fav_comics.push(response.data);
//          await user.save();
//          console.log(user);
//       } else {
//          res.status(400).json({
//             message: "Missing information.",
//          });
//       }
//    } catch (error) {
//       console.log(error);
//    }
// });

// ROUTE EXPORT
module.exports = router;
