// Imports
const { Router } = require("express");

// Define Router
var route = Router();

// Blog Endpoint
route.get("*", (req, res, next) => {
  let data = {
    user: req.user
  };
  res.render("blog/coming-soon", data);
});

// Define Route
module.exports = route;
