// Imports
const { Router } = require("express");

// Config Imports
const { maintenance_mode } = require("../config/web");
const { DEVELOPER_IDS } = require("../config/misc");

// Define Router
var route = Router();

// Maint Mode
route.get("*", async (req, res, next) => {
  if (!maintenance_mode) return next();
  if (req.user && DEVELOPER_IDS.includes(req.user.id)) return next();
  let data = {
    user: req.user
  };

  res.render("partials/error/maintenance", data);
});

// Define Route
module.exports = route;
