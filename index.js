// PACKAGES IMPORT & INIT.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formidable = require("express-formidable");

const app = express();
app.use(cors());
app.use(formidable());

// ROUTES IMPORT
const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);

const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

// WRONG ROUTES
app.all("*", (req, res) => {
   res.status(404).json({ error: "Page not found" });
});

// SERVER
// process.env.PORT ||
app.listen(3100, () => {
   console.log("Server started");
});
