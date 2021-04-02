// Imports
const { Router } = require("express");
const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
var fetch = require("node-fetch");

// Import Models
const guild = require("../models/guild");
const infractionsSchema = require("../models/infractions");

// Import Config
const { DEVELOPER_IDS } = require("../config/misc");
const { CONTROL_CHANNEL_ID } = require("../config/webhooks");
const { EMBED_COLOR } = require("../config/colors");

// Import Routes
const maintenance = require("./maintenance");

// Define Router
var route = Router();

// Maint Page
route.use("*", maintenance);

// Dev Portal
route.get("/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  let manageArray = [];
  const guilds = await guild.find({});
  manageArray.sort((a, b) => (a === b ? 0 : a ? -1 : 1));
  let data = {
    user: req.user,
    guilds: manageArray,
    guild: guilds,
    user_size: req.app.get("client").users.cache.size,
    channel_size: req.app.get("client").channels.cache.size,
    guild_size: req.app.get("client").guilds.cache.size,
    supportserver_size: req.app.get("client").guilds.cache.get("732708260519346217").memberCount,
    isDeveloper: developer
  };
  res.render("admin/index", data);
});

// Blacklisted Guilds
route.get("/blacklisted-guilds", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  let manageArray = [];
  const guilds = await guild.find({ is_blacklisted: true });
  manageArray.sort((a, b) => (a === b ? 0 : a ? -1 : 1));
  let data = {
    user: req.user,
    guilds: manageArray,
    guild: guilds,
    user_size: req.app.get("client").users.cache.size,
    channel_size: req.app.get("client").channels.cache.size,
    guild_size: req.app.get("client").guilds.cache.size,
    supportserver_size: req.app.get("client").guilds.cache.get("732708260519346217").memberCount,
    isDeveloper: developer
  };
  res.render("admin/blacklisted-guilds", data);
});

// Developer API: Users
route.get("/users", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  let data = {
    user: req.user,
    users: req.app.get("client").users.cache.map((user) => user.tag + ` (ID: ${user.id})`),
    isDeveloper: developer
  };
  res.send(data.users);
});

// Developer API: Channels
route.get("/channels", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");

  let data = {
    user: req.user,
    channels: req.app
      .get("client")
      .channels.cache.map((channel) => `(${channel.id}) | Guild: ${channel.guild.name} (${channel.guild.id})`)
  };
  res.send(data.channels);
});

// Developer API: Stats
route.get("/stats", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");

  let data = {
    user_size: req.app.get("client").users.cache.size,
    guild_size: req.app.get("client").guilds.cache.size,
    channel_size: req.app.get("client").channels.cache.size,
    owner: req.app
      .get("client")
      .guilds.cache.get("732708260519346217")
      .members.cache.filter((member) => {
        return member.roles.cache.find((r) => r.name === "Owner");
      })
      .map((member) => {
        return member.user.tag + " (" + member.user.id + ")";
      }),
    senior_developers: req.app
      .get("client")
      .guilds.cache.get("732708260519346217")
      .members.cache.filter((member) => {
        return member.roles.cache.find((r) => r.name === "Sr. Developers");
      })
      .map((member) => {
        return member.user.tag + " (" + member.user.id + ")";
      }),
    developers: req.app
      .get("client")
      .guilds.cache.get("732708260519346217")
      .members.cache.filter((member) => {
        return member.roles.cache.find((r) => r.name === "Developers");
      })
      .map((member) => {
        return member.user.tag + " (" + member.user.id + ")";
      }),
    support: req.app
      .get("client")
      .guilds.cache.get("732708260519346217")
      .members.cache.filter((member) => {
        return member.roles.cache.find((r) => r.name === "Support");
      })
      .map((member) => {
        return member.user.tag + " (" + member.user.id + ")";
      }),
    moderators: req.app
      .get("client")
      .guilds.cache.get("732708260519346217")
      .members.cache.filter((member) => {
        return member.roles.cache.find((r) => r.name === "Moderators");
      })
      .map((member) => {
        return member.user.tag + " (" + member.user.id + ")";
      }),
    guild_data: req.app.get("client").guilds.cache.map((guild) => guild.name + ` (${guild.id})`)
  };
  res.send(data);
});

// Developer Portal: Guild Flags
route.get("/flags/:id", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  const guildData = await guild.find({ guildID: req.params.id });
  console.log(guildData);
  let data = {
    user: req.user,
    name: guildData.guildName,
    id: guildData.guildID,
    discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
    guild: guildData,
    isDeveloper: developer
  };
  res.render("admin/flags/guild", data);
});

// Developer Portal: Add Premium Guild Flag
route.get("/flags/:id/add-premium/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  if (flag.badges === "Premium Guild") return res.json({ owo: "This guild is already flagged as premium." });
  await flag.updateOne({ badges: "Premium Guild" });
  await flag.updateOne({ is_premium: true });
  res.json({ "Guild Flag Awarded": "Premium Guild" });
  const owner = req.app.get("client").guilds.cache.get(req.params.id).ownerID;
  req.app
    .get("client")
    .users.cache.get(owner)
    .send("Your guild has been awarded the `Premium Server` guild flag.");
});

// Developer Portal: Remove Premium Guild Flag
route.get("/flags/:id/remove-premium/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  await flag.updateOne({ badges: null });
  await flag.updateOne({ is_premium: false });
  res.json({ "Guild Flag Removed": "Premium Guild" });
});

// Developer Portal: Add Support Server Guild Flag
route.get("/flags/:id/add-support/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  if (flag.badges === "Official Support Server")
    return res.json({ owo: "This guild is already flagged as an Official Support Server." });
  await flag.updateOne({ badges: "Official Support Server" });
  await flag.updateOne({ is_premium: true });
  res.json({ "Guild Flag Awarded": "Official Support Server" });
  const owner = req.app.get("client").guilds.cache.get(req.params.id).ownerID;
  req.app
    .get("client")
    .users.cache.get(owner)
    .send("Your guild has been awarded the `Official Support Server` guild flag.");
});

// Developer Portal: Remove Support Server Guild Flag
route.get("/flags/:id/remove-support/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  await flag.updateOne({ badges: null });
  res.json({ "Guild Flag Removed": "Official Support Server" });
});

// Developer Portal: Add Contributor Guild Flag
route.get("/flags/:id/add-contributer/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  if (flag.badges === "Contributer, Early Supporter, Premium")
    return res.json({ owo: "This guild is already flagged as a Contributer, Early Supporter, Premium" });
  await flag.updateOne({ badges: "Contributer, Early Supporter, Premium" });
  await flag.updateOne({ is_premium: true });
  res.json({ "Guild Flag Awarded": "Contributer, Early Supporter, Premium" });
  const owner = req.app.get("client").guilds.cache.get(req.params.id).ownerID;
  req.app
    .get("client")
    .users.cache.get(owner)
    .send("Your guild has been awarded the `Contributer, Early Supporter, Premium` guild flag.");
});

// Developer Portal: Remove Contributor Guild Flag
route.get("/flags/:id/remove-contributer/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  await flag.updateOne({ badges: null });
  await flag.updateOne({ is_premium: false });
  res.json({ "Guild Flag Removed": "Contributer, Premium, Early Supporter" });
});

// Developer Portal: Add Early Supporter Guild Flag
route.get("/flags/:id/add-early-supporter/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  if (flag.badges === "Early Supporter")
    return res.json({ owo: "This guild is already flagged as an Early Supporter." });
  await flag.updateOne({ badges: "Early Supporter" });
  const owner = req.app.get("client").guilds.cache.get(req.params.id).ownerID;
  res.json({ "Guild Flag Added": "Early Supporter" });
  req.app
    .get("client")
    .users.cache.get(owner)
    .send("Your guild has been awarded the `Early Supporter` guild flag.");
});

// Developer Portal: Remove Early Supporter Guild Flag
route.get("/flags/:id/remove-early-supporter/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  await flag.updateOne({ badges: null });
  res.json({ "Guild Flag Removed": "Early Supporter" });
});

// Developer Portal: Blacklist a Guild
route.get("/flags/:id/blacklist/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  if (flag.is_blacklisted === true) return res.json({ owo: "This guild is already blacklisted." });
  await flag.updateOne({ is_blacklisted: true });
  await flag.updateOne({ badges: "Blacklisted Guild" });
  res.json({ "Guild Flag Added": "Blacklisted Guild" });
  const owner = req.app.get("client").guilds.cache.get(req.params.id).ownerID;
  req.app
    .get("client")
    .users.cache.get(owner)
    .send("Your guild has been awarded the `Blacklisted` guild flag.");
});

// Developer Portal: Unblacklist a Guild
route.get("/flags/:id/unblacklist/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  if (flag.is_blacklisted === false) return res.json({ owo: "This guild is not blacklisted." });
  await flag.updateOne({ is_blacklisted: false });
  await flag.updateOne({ badges: null });
  res.json({ "Guild Flag Removed": "Blacklisted Guild" });
});

// Developer Portal: Add Beta Guild Flag
route.get("/flags/:id/add-beta/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  if (flag.betaGuild === true) return res.json({ owo: "This guild is already flagged as a beta guild." });
  await flag.updateOne({ betaGuild: true });
  res.json({ "Guild Flag Added": "Beta Tester Guild" });
  const owner = req.app.get("client").guilds.cache.get(req.params.id).ownerID;
  req.app
    .get("client")
    .users.cache.get(owner)
    .send("Your guild has been awarded the `Beta Tester` guild flag.");
});

// Developer Portal: Remove Beta Guild Flag
route.get("/flags/:id/remove-beta/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const flag = await guild.findOne({ guildID: req.params.id });
  if (!flag) return res.json({ owo: "Guild not in DB" });
  if (flag.betaGuild === false) return res.json({ owo: "This guild is not flagged as a beta tester." });
  await flag.updateOne({ betaGuild: false });
  res.json({ "Guild Flag Removed": "Beta Tester Guild" });
});

// Developer Portal: Leave Guild
route.get("/flags/:id/leave/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!DEVELOPER_IDS.includes(req.user.id)) return res.redirect("/403?error=unauthorized");
  res.setHeader("Content-Type", "application/json");
  const discordguild = req.app.get("client").guilds.cache.get(req.params.id);
  if (!discordguild) {
    return res.json({
      "Guild Status": "Inactive",
      Endpoints: {
        "Guild Infractions": `https://tritan.gg/dashboard/${req.params.id}/infractions`,
        "Guild Data": `https://tritan.gg/api/v1/guild/${req.params.id}`
      }
    });
  }

  try {
    req.app.get("client").guilds.cache.get(req.params.id).leave();
    res.json({ "Left Guild": "Success" });
    let guildLeft = new MessageEmbed();
    guildLeft.setTitle("GUILD LEFT BY DEVELOPER");
    guildLeft.addField("User", req.user.username, true);
    guildLeft.addField("Guild ID", req.params.id, true);
    guildLeft.setColor(EMBED_COLOR);
    guildLeft.setTimestamp();
    req.app.get("client").channels.cache.get(CONTROL_CHANNEL_ID).send(guildLeft);
  } catch (error) {
    let errorLeave = new MessageEmbed();
    errorLeave.setTitle("DEVELOPER TRIED LEAVING GUILD, ERROR");
    errorLeave.addField("User", req.user.username, true);
    errorLeave.addField("Guild ID", req.params.id, true);
    errorLeave.addField("Error", error, true);
    errorLeave.setColor(EMBED_COLOR);
    errorLeave.setTimestamp();
    req.app.get("client").channels.cache.get(CONTROL_CHANNEL_ID).send(errorLeave);
    res.json({ "Error:": error });
  }
});

// Define Route
module.exports = route;
