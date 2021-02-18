// PACKAGES IMPORT & INIT.
const express = require("express");
const axios = require("axios");
const router = express.Router();

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

// ROUTE EXPORT
module.exports = router;
