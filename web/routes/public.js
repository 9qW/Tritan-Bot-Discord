// Imports
const { Router } = require("express");
const mongoose = require("mongoose");

// Model Imports
const Levels = require("../models/levels");
const Messages = require("../models/messages");

// Route Imports
const maintenance = require("./maintenance");

// Config Imports
const { DEVELOPER_IDS } = require("../config/misc");

// Define Router
var route = Router();

// Maint Page
route.use("*", maintenance);

// Public Rank Leaderboard
route.get("/:id/ranks", async (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  const levelData = await Levels.find({ guildID: req.params.id });

  let data = {
    guild: req.params.id,
    user: req.user,
    discord_data: req.app.get("client"),
    Levels: levelData,
    guild_name: req.app.get("client").guilds.cache.get(req.params.id).name,
    isDeveloper: developer
  };
  res.render("public/ranks", data);
});

// Public Message Leaderboard
route.get("/:id/messages", async (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  const MessageData = await Messages.find({ guildID: req.params.id });
  let data = {
    guild: req.params.id,
    user: req.user,
    discord_data: req.app.get("client"),
    Messages: MessageData,
    guild_name: req.app.get("client").guilds.cache.get(req.params.id).name,
    isDeveloper: developer
  };
  res.render("public/messages", data);
});

// Define Route
module.exports = route;
