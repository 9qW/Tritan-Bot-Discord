// Imports
const { Router } = require("express");
const fetch = require("node-fetch");

// Config
const { alert_active, alert_text } = require("../config/web");
const { DEVELOPER_IDS } = require("../config/misc");

// Route Imports
const admin = require("./admin");
const api = require("./api");
const blog = require("./blog");
const dashboard = require("./dashboard");
const maintenance = require("./maintenance");
const public = require("./public");
const vanity = require("./v");

// Models
const commands = require("../models/commands");
const commandsSchema = require("../models/commands");

// Init Router
var route = Router();

// Routes Init
route.use("*", maintenance);
route.use("/admin", admin);
route.use("/api", api);
route.use("/blog", blog);
route.use("/dashboard", dashboard);
route.use("/public", public);
route.use("/v", vanity);

// Landing Page
route.get("/", async (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }
  let data = {
    user: req.user,
    total_users: req.app.get("client").users.cache.size,
    total_channels: req.app.get("client").channels.cache.size,
    total_guilds: req.app.get("client").guilds.cache.size,
    ping: req.app.get("client").ws.ping,
    isDeveloper: developer,
    alert_active: alert_active,
    alert_text: alert_text
  };
  res.render("home/index", data);
});

// About Page
route.get("/about", async (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  const commands = await commandsSchema.find({});

  const response = await fetch("https://statcord.com/logan/stats/732783297872003114");
  const json = await response.json();
  const stats = json.popular;

  let data = {
    user: req.user,
    commands: commands,
    stats: stats,
    isDeveloper: developer
  };
  res.render("home/about", data);
});

// PR Policy Page
route.get("/privacy-policy", (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }
  let data = {
    user: req.user,
    isDeveloper: developer
  };
  res.render("home/privacy-policy", data);
});

// TOS Page
route.get("/terms-of-service", (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  let data = {
    user: req.user,
    isDeveloper: developer
  };
  res.render("home/terms-of-service", data);
});

// Helpdesk Form
route.get("/contact", (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  let data = {
    user: req.user,
    isDeveloper: developer
  };
  res.render("home/contact", data);
});

// Redirections
route.get("/docs", (req, res, next) => {
  res.redirect("https://wiki.tritan.gg");
});

route.get("/status", (req, res, next) => {
  res.redirect("https://status.tritan.gg");
});

route.get("/invite", (req, res, next) => {
  res.redirect("https://discord.com/oauth2/authorize?client_id=732783297872003114&permissions=8&scope=bot");
});

route.get("/support", (req, res, next) => {
  res.redirect("https://discord.com/invite/ScUgyE2");
});

route.get("/stats", (req, res, next) => {
  res.redirect("https://statcord.com/bot/732783297872003114");
});

route.get("/vote", (req, res, next) => {
  res.redirect("https://top.gg/bot/732783297872003114/vote");
});

// Error Pages
route.get("/404", (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }
  let data = {
    user: req.user,
    isDeveloper: developer
  };
  res.render("partials/error/404", data);
});

route.get("/403", (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }
  let data = {
    user: req.user,
    isDeveloper: developer
  };
  res.render("partials/error/403", data);
});

// Error Direction
route.get("*", (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }
  let data = {
    user: req.user,
    isDeveloper: developer
  };
  res.redirect("/404?error=notfound");
});

// Define
module.exports = route;
