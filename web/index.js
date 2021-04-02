// Messy
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const config = require("./config/web");
const tokens = require("./config/tokens");
const discord = require("discord.js");
const mongoose = require("mongoose");
const MemoryStore = require("memorystore")(session);
const chalk = require("chalk");
const fs = require("fs");
const votehooks = require("./helpers/votehooks");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const setDomain = require("express-set-domain");
const { DEVELOPER_IDS } = require("./config/misc");

// Discord Client
const client = new discord.Client({
  fetchAllMembers: true,
  fetchAllChannels: true,
  fetchAllGuilds: true,
  disableMentions: "everyone",
  fetchAllRoles: true
});

// Votehooks Helper
votehooks(client);

// Init Express
var app = express();

// Error Handling
Sentry.init({
  dsn: config.sentry_dsn,
  integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
  tracesSampleRate: 1.0
});

// Express Config
app.disable("x-powered-by");
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(function (req, res, next) {
  if (req.url.match(/^\/(css|js|img|font)\/.+/)) {
    res.setHeader("Cache-Control", "public, max-age=900"); // cache header in seconds
  }
  next();
});
app.set("views", "./views");
app.set("client", client);
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(compression());
app.use(setDomain(config.domain));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Auth
passport.use(
  new Strategy(
    {
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
      scope: ["identify", "guilds"]
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    secret: "heheuwu123%#@%#oijfwjfksfoijfoijsfof09u90wu@#!@#!@",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Login Route
app.get(
  "/login",
  (req, res, next) => {
    req.session.backURL = req.get("Referer");
    res.cookie("referer", req.get("Referer"));
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.get("Referrer")) {
      const parsed = url.parse(req.get("Referrer"));
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  },
  passport.authenticate("discord")
);

// Callback Route
app.get(
  "/api/callback",
  passport.authenticate("discord", {
    failureRedirect: "/403?error=oauth-login-failed"
  }),
  (req, res) => {
    if (req.cookies) {
      const url = req.headers.referrer;
      req.session.backURL = null;
      res.redirect(req.cookies.referer);
    } else {
      if (DEVELOPER_IDS.includes(req.user.id)) {
        return res.redirect("/admin");
      }
      res.redirect("/dashboard");
    }
  }
);

// Logout Route
app.get("/logout", function (req, res) {
  req.session.destroy(() => {
    req.logout();
    res.redirect("/");
  });
});

// Arc.io Widget
app.get("/arc-sw.js", function (req, res) {
  res.type("application/javascript");
  res.send(
    '!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=100)}({100:function(e,t,r){"use strict";r.r(t);var n=r(3);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+n.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+n.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+n.b;importScripts(i)}},3:function(e,t,r){"use strict";r.d(t,"a",function(){return n}),r.d(t,"f",function(){return c}),r.d(t,"j",function(){return i}),r.d(t,"i",function(){return a}),r.d(t,"b",function(){return d}),r.d(t,"k",function(){return f}),r.d(t,"c",function(){return p}),r.d(t,"d",function(){return s}),r.d(t,"e",function(){return l}),r.d(t,"g",function(){return m}),r.d(t,"h",function(){return v});var n={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["swf"]},o="arc:",c={COMLINK_INIT:"".concat(o,"comlink:init"),NODE_ID:"".concat(o,":nodeId"),CDN_CONFIG:"".concat(o,"cdn:config"),P2P_CLIENT_READY:"".concat(o,"cdn:ready"),STORED_FIDS:"".concat(o,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(o,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(o,"widget:config"),WIDGET_INIT:"".concat(o,"widget:init"),WIDGET_UI_LOAD:"".concat(o,"widget:load"),BROKER_LOAD:"".concat(o,"broker:load"),RENDER_FILE:"".concat(o,"inlay:renderFile"),FILE_RENDERED:"".concat(o,"inlay:fileRendered")},i="serviceWorker",a="/".concat("shared-worker",".js"),d="/".concat("dedicated-worker",".js"),f="/".concat("arc-sw-core",".js"),u="".concat("arc-sw",".js"),p=("/".concat(u),"/".concat("arc-sw"),"arc-db"),s="key-val-store",l=2**17,m="".concat("https://overmind.arc.io","/api/propertySession"),v="".concat("https://warden.arc.io","/mailbox/propertySession")}});'
  );
});

// Discord Client Init & DB
client.on("ready", async () => {
  console.log(chalk.greenBright("[WEB STARTUP]"), `Web is connected to Discord's API.`);
  (async () => {
    await mongoose
      .connect(tokens.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        poolSize: 5,
        connectTimeoutMS: 10000,
        family: 4
      })
      .then(() => console.log(chalk.greenBright("[WEB STARTUP]"), "Web connected to MongoDB"));
    app.listen(config.port, () => {
      console.log(chalk.greenBright("[WEB READY]"), `Web running on port ${config.port}.`);
    });
  })();
});

// Load Routes
loadRoutes();

// Init Sentry
app.use(Sentry.Handlers.errorHandler());

// Login Discord
client.login(tokens.TOKEN);

// Functions
function loadRoutes() {
  const routesPath = path.join(__dirname, "./routes");

  fs.readdir(routesPath, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((filename) => {
      const route = require(path.join(routesPath, filename));

      const routePath = filename === "index.js" ? "/" : `/${filename.slice(0, -3)}`;

      try {
        app.use(routePath, route);
        console.log(chalk.yellowBright("[LOADING ENDPOINT]"), `${routePath}`);
      } catch (error) {
        console.log(
          chalk.redBright("[WEB STARTUP ERROR] (Failed to load route)"),
          `Error occured with the route "${filename}":\n\n${error} Ignoreing continuing`
        );
      }
    });
  });

  return this;
}
