// Imports
const { Router } = require("express");
const mongoose = require("mongoose");

// Import Settings
const { DEVELOPER_IDS } = require("../config/misc");

// Import Models
const guild = require("../models/guild");
const infractions = require("../models/infractions");
const economy = require("../models/economy");
const levels = require("../models/levels");
const reminders = require("../models/reminders");
const messages = require("../models/messages");
const webhooks = require("../models/webhooks");

// Import Routes
const maintenance = require("./maintenance");

// Define Router
var route = Router();

// Maint Page
route.use("*", maintenance);

// API Frontend UI
route.get("/", (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  let data = {
    user: req.user,
    isDeveloper: developer
  };
  res.render("api/index", data);
});

// Data Removal UI
route.get("/v1/data-removal", (req, res, next) => {
  if (!req.user) return res.redirect("/login");

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  let data = {
    user: req.user,
    isDeveloper: developer
  };
  res.render("api/v1/data_removal", data);
});

// Auto data fetching for logged in users
route.get("/v1/me", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  res.setHeader("Content-Type", "application/json");
  let Economy_Data = await economy.find({ userId: req.user.id });
  let Rank_Data = await levels.find({ userID: req.user.id });
  let Message_Data = await messages.find({ userID: req.user.id });
  let Reminder_Data = await reminders.find({ authorID: req.user.id });
  let Infractions_Received = await infractions.find({ TargetID: req.user.id });
  let Infractions_Given = await infractions.find({ ModeratorID: req.user.id });

  let data = {
    Your_Data: "Within this json file lies all of your collected data.",
    Economy_Data: Economy_Data,
    Rank_Data: Rank_Data,
    Message_Data: Message_Data,
    Reminder_Data: Reminder_Data,
    Infractions_Received: Infractions_Received,
    Infractions_Given: Infractions_Given
  };
  res.end(JSON.stringify(data));
});

// Get user info by ID
route.get("/v1/user/:id", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  let Economy_Data = await economy.find({ userId: req.params.id });
  let Rank_Data = await levels.find({ userID: req.params.id });
  let Message_Data = await messages.find({ userID: req.params.id });
  let Reminder_Data = await reminders.find({ authorID: req.params.id });
  let Infractions_Received = await infractions.find({ TargetID: req.params.id });
  let Infractions_Given = await infractions.find({ ModeratorID: req.params.id });

  let data = {
    Your_Data: "Within this json file lies all of your collected data.",
    Economy_Data: Economy_Data,
    Rank_Data: Rank_Data,
    Message_Data: Message_Data,
    Reminder_Data: Reminder_Data,
    Infractions_Received: Infractions_Received,
    Infractions_Given: Infractions_Given
  };
  res.end(JSON.stringify(data));
});

// Guild Info by ID
route.get("/v1/guild/:id", async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let Guild_Data = await guild.find({ guildID: req.params.id });
  if (!Guild_Data) {
    return res.end(
      JSON.stringify({ error: true, message: "The guild data for this request was not found." })
    );
  }
  let Rank_Data = await levels.find({ guildID: req.params.id });
  let Infraction_Data = await infractions.find({ GuildID: req.params.id });
  let Message_Data = await messages.find({ guildID: req.params.id });
  let Reminder_Data = await reminders.find({ guildID: req.params.id });
  let Webhooks_Data = await webhooks.find({ guildID: req.params.id });

  let data = {
    Guild_Data: Guild_Data,
    Rank_Data: Rank_Data,
    Message_Data: Message_Data,
    Reminder_Data: Reminder_Data,
    Infraction_Data: Infraction_Data,
    Webhooks_Data: Webhooks_Data
  };
  res.end(JSON.stringify(data));
});

// Infractions by ID
route.get("/v1/infraction/:id", async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let infractiondata = await infractions.find({ _id: req.params.id });
  if (!infractiondata) {
    return res.end(JSON.stringify({ error: true, message: "The infraction ID provided was not valid." }));
  }
  let data = {
    infractions: infractiondata
  };
  res.end(JSON.stringify(data));
});

// Define Route
module.exports = route;
