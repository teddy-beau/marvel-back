// PACKAGES IMPORT & INIT.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formidable = require("express-formidable");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(formidable());

// CONNECTION TO MONGODB
mongoose.connect(process.env.MONGODB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
});

// ROUTES IMPORT
const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);

const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

const userRoutes = require("./routes/user");
app.use(userRoutes);

// WRONG ROUTES
app.all("*", (req, res) => {
   res.status(404).json({ error: "Page not found" });
});

// SERVER
app.listen(process.env.PORT || 3100, () => {
   console.log("Server started");
});
