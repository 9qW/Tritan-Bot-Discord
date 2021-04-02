// Imports
const { Router } = require("express");

// Route Imports
const maintenance = require("./maintenance");

// Model Imports
const guildData = require("../models/guild");

// Init Router
var route = Router();

// Maint Page
route.use("*", maintenance);

// Vanity URL Handling
route.get("/:vanityURL", async (req, res, next) => {
  const data = await guildData.findOne({ vanityURL: req.params.vanityURL });

  if (!data) {
    return res.redirect("/v");
  }

  res.redirect("https://discord.gg/" + data.vanityRedirect);
});

// Define Route
module.exports = route;
