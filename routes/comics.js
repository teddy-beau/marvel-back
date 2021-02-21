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
         title = req.query.title;
      }

      const response = await axios.get(
         `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}&limit=${limit}&skip=${skip}&title=${title}`
      );
      res.status(200).json(response.data);
   } catch (error) {
      console.log(error);
   }
});

// ROUTE: COMICS FOR 1 CHARACTER
router.get("/comics/:characterId", async (req, res) => {
   try {
      const response = await axios.get(
         `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`
      );
      console.log(`Character details accessed`);
      res.status(200).json(response.data);
   } catch (error) {
      console.log(error);
   }
});

// ROUTE: ADD COMIC TO LIST
router.post("/comics/save", isAuthenticated, async (req, res) => {
   try {
      if (req.fields.comic && req.fields.userId) {
         // Find user:
         const user = await User.findById(req.fields.userId);
         // Check if the comic is already saved:
         let isInList = false;
         user.fav_comics.map((elem) => {
            if (elem._id === req.fields.comic._id) {
               isInList = true;
            }
         });
         // If there's no match, add comic to user list:
         if (!isInList) {
            user.fav_comics.push(req.fields.comic);
            await user.save();
         }
         console.log(`1 comic added to user list`);
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

// ROUTE: REMOVE COMIC FROM LIST
router.post("/comics/unsave", isAuthenticated, async (req, res) => {
   try {
      if (req.fields.item && req.fields.userId) {
         // Find user:
         const user = await User.findById(req.fields.userId);
         // Remove from user list:
         user.fav_comics.map((elem, index) => {
            if (elem._id === req.fields.item._id) {
               user.fav_comics.splice(index, 1);
            }
         });
         // Save changes:
         await user.save();
         console.log(`1 comic removed from user list`);
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
