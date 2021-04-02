// Imports
const { Router } = require("express");
const { MessageEmbed } = require("discord.js");

// Import Models
const guild = require("../models/guild");
const infractions = require("../models/infractions");

// Import Config
const { DEVELOPER_IDS } = require("../config/misc");
const { EMBED_COLOR } = require("../config/colors");
const { CONTROL_CHANNEL_ID } = require("../config/webhooks");

// Import Routes
const maintenance = require("./maintenance");

// Define Router
var route = Router();

// Perms Map
const map = {
  CREATE_INSTANT_INVITE: 1 << 0,
  KICK_MEMBERS: 1 << 1,
  BAN_MEMBERS: 1 << 2,
  ADMINISTRATOR: 1 << 3,
  MANAGE_CHANNELS: 1 << 4,
  MANAGE_GUILD: 1 << 5,
  ADD_REACTIONS: 1 << 6,
  VIEW_AUDIT_LOG: 1 << 7,
  PRIORITY_SPEAKER: 1 << 8,
  STREAM: 1 << 9,
  VIEW_CHANNEL: 1 << 10,
  SEND_MESSAGES: 1 << 11,
  SEND_TTS_MESSAGES: 1 << 12,
  MANAGE_MESSAGES: 1 << 13,
  EMBED_LINKS: 1 << 14,
  ATTACH_FILES: 1 << 15,
  READ_MESSAGE_HISTORY: 1 << 16,
  MENTION_EVERYONE: 1 << 17,
  USE_EXTERNAL_EMOJIS: 1 << 18,
  VIEW_GUILD_INSIGHTS: 1 << 19,
  CONNECT: 1 << 20,
  SPEAK: 1 << 21,
  MUTE_MEMBERS: 1 << 22,
  DEAFEN_MEMBERS: 1 << 23,
  MOVE_MEMBERS: 1 << 24,
  USE_VAD: 1 << 25,
  CHANGE_NICKNAME: 1 << 26,
  MANAGE_NICKNAMES: 1 << 27,
  MANAGE_ROLES: 1 << 28,
  MANAGE_WEBHOOKS: 1 << 29,
  MANAGE_EMOJIS: 1 << 30
};

// Maint Route
route.use("*", maintenance);

// Dashboard Guild Selector
route.get("/", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");

  let manageArray = [];
  let guilds = req.app.get("client").guilds.cache;

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  req.user.guilds.forEach(async (guild) => {
    if (guild.permissions & map.MANAGE_GUILD) {
      manageArray.push({
        guild: guild,
        isAuthenticated: guilds.find((guild_) => guild_.id == guild.id) ? true : false
      });
      console.log(guilds.find((guild_) => guild_.id == guild.id) ? true : false);
    }
  });

  manageArray.sort((a, b) => (a === b ? 0 : a ? -1 : 1));

  const total_infractions = await infractions.find({});

  let data = {
    user: req.user,
    guilds: manageArray,
    isDeveloper: developer,
    total_users: req.app.get("client").users.cache.size,
    total_channels: req.app.get("client").channels.cache.size,
    total_guilds: req.app.get("client").guilds.cache.size,
    total_infractions: total_infractions.length
  };
  res.render("dash/index", data);
});

// Dashboard Guild Landing
route.get("/:id", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");

  const guildData = await guild.findOne({ guildID: req.params.id });
  if (!guildData) return res.redirect("/invite");

  let authedGuilds = [];
  if (DEVELOPER_IDS.includes(req.user.id)) authedGuilds.push({ guildData });

  //const guildcache = req.app.get("client").guilds.cache.map((guild) => guild.id);
  const isInCache = req.app.get("client").guilds.cache.get(req.params.id);
  if (!isInCache) {
    return res.json({
      "Guild Status": "Inactive",
      Endpoints: {
        "Guild Data": `https://tritan.gg/api/v1/guild/${req.params.id}`,
        "Guild Flags": `https://tritan.gg/admin/flags/${req.params.id}`
      }
    });
  }

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  req.user.guilds.forEach((guild) => {
    if (guild.id == req.params.id) {
      if (!guild.permissions & map.MANAGE_GUILD) return next();

      authedGuilds.push({ guildData });
    } else {
      return;
    }
  });

  if (authedGuilds.length == 0) return next();

  if (req.app.get("client").guilds.cache.get(req.params.id)) {
    const guild = req.app.get("client").guilds.cache.get(req.params.id);
    var emojiArr = [];
    const emojiList = guild.emojis.cache.map((e, x) =>
      emojiArr.push(`https://cdn.discordapp.com/emojis/${e.id}.png`)
    );
  }
  console.log(authedGuilds);

  const guildinfsize = await infractions.find({ GuildID: req.params.id });

  let data = {
    guild: req.params.id,
    user: req.user,
    discord: req.app.get("client"),
    discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
    discord_user: req.app.get("client").users.cache.get("req.user.id"),
    membercount: req.app.get("client").guilds.cache.get(req.params.id).memberCount,
    botcount: req.app
      .get("client")
      .guilds.cache.get(req.params.id)
      .members.cache.filter((m) => m.user.bot).size,
    rolecount: req.app.get("client").guilds.cache.get(req.params.id).roles.cache.size,
    channelcount: req.app.get("client").guilds.cache.get(req.params.id).channels.cache.size,
    textchannels: req.app
      .get("client")
      .guilds.cache.get(req.params.id)
      .channels.cache.filter((channel) => channel.type === "text").size,
    voicechannels: req.app
      .get("client")
      .guilds.cache.get(req.params.id)
      .channels.cache.filter((channel) => channel.type === "voice").size,
    verificationLevel: req.app.get("client").guilds.cache.get(req.params.id).verificationLevel,
    emojicount: req.app.get("client").guilds.cache.get(req.params.id).emojis.cache.size,
    region: req.app.get("client").guilds.cache.get(req.params.id).region,
    partnered: req.app.get("client").guilds.cache.get(req.params.id).partnered,
    is_premium: guildData.is_premium,
    is_blacklisted: guildData.is_blacklisted,
    guildData: guildData,
    emojis: emojiArr,
    betaGuild: guildData.betaGuild,
    isDeveloper: developer,
    customStatsRole: req.app
      .get("client")
      .guilds.cache.get(req.params.id)
      .roles.cache.get(guildData.customStatsRole),
    total_infractions: guildinfsize.length
  };
  res.render("dash/guild", data);
});

// Dashboard Guild Settings
route.get("/:id/settings", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");

  const guildData = await guild.findOne({ guildID: req.params.id });
  if (!guildData) return res.redirect("/invite");

  let authedGuilds = [];

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  if (DEVELOPER_IDS.includes(req.user.id)) authedGuilds.push({ guildData });
  req.user.guilds.forEach((guild) => {
    if (guild.id == req.params.id) {
      if (!guild.permissions & map.MANAGE_GUILD) return next();

      authedGuilds.push(guildData);
    } else {
      return;
    }
  });
  if (authedGuilds.length == 0) return next();
  console.log(authedGuilds);
  let data = {
    guild: req.params.id,
    user: req.user,
    prefix: guildData.prefix,
    join_leave: guildData.join_leave,
    event_logs: guildData.event_logs,
    mute_role: guildData.mute_role,
    rank_channel: guildData.rank_channel,
    customStatsRole: guildData.customStatsRole,
    vanityURL: guildData.vanityURL,
    vanityRedirect: guildData.vanityRedirect,
    autodeletechannel: guildData.auto_delete_channel,
    autodeletekeyword: guildData.auto_delete_keyword,
    discord: req.app.get("client"),
    discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
    isDeveloper: developer,
    savedChanges: false,
    vanity_in_use: false
  };
  res.render("dash/settings", data);
});

// Dashboard Guild Settings (Saving)
route.post("/:id/settings", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  const guildData = await guild.findOne({ guildID: req.params.id });
  if (!guildData) return res.redirect("/invite");

  let authedGuilds = [];

  if (DEVELOPER_IDS.includes(req.user.id)) authedGuilds.push({ guildData });

  req.user.guilds.forEach((guild) => {
    if (guild.id == req.params.id) {
      if (!guild.permissions & map.MANAGE_GUILD) return next();

      authedGuilds.push(guildData);
    } else {
      return;
    }
  });
  if (authedGuilds.length == 0) return next();

  if (req.body.prefix) {
    await guildData.updateOne({ prefix: req.body.prefix });
  }

  if (req.body.event_logs) {
    await guildData.updateOne({ event_logs: req.body.event_logs });
  }

  if (req.body.join_leave) {
    await guildData.updateOne({ join_leave: req.body.join_leave });
  }

  if (req.body.mute_role) {
    await guildData.updateOne({ mute_role: req.body.mute_role });
  }

  if (req.body.rank_channel) {
    await guildData.updateOne({ rank_channel: req.body.rank_channel });
  }

  if (req.body.customStatsRole) {
    await guildData.updateOne({ customStatsRole: req.body.customStatsRole });
  }

  if (req.body.autodeletechannel) {
    await guildData.updateOne({ auto_delete_channel: req.body.autodeletechannel });
  }

  if (req.body.autodeletekeyword) {
    await guildData.updateOne({ auto_delete_keyword: req.body.autodeletekeyword });
  }

  const check = await guild.findOne({ vanityURL: req.body.vanityURL });

  let vanity_in_use = false;

  if (req.body.vanityURL) {
    if (check) {
      let vanity_in_use = true;

      let data = {
        guild: req.params.id,
        user: req.user,
        prefix: guildData.prefix,
        join_leave: guildData.join_leave,
        event_logs: guildData.event_logs,
        mute_role: guildData.mute_role,
        rank_channel: guildData.rank_channel,
        customStatsRole: guildData.customStatsRole,
        vanityURL: guildData.vanityURL,
        vanityRedirect: guildData.vanityRedirect,
        autodeletechannel: guildData.auto_delete_channel,
        autodeletekeyword: guildData.auto_delete_keyword,
        discord: req.app.get("client"),
        discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
        isDeveloper: developer,
        savedChanges: false,
        vanity_in_use: vanity_in_use
      };
      return res.render("dash/settings", data);
    }

    if (req.body.vanityURL) {
      if (!check) {
        await guildData.updateOne({ vanityURL: req.body.vanityURL });
      }
    }

    if (req.body.vanityRedirect) {
      await guildData.updateOne({ vanityRedirect: req.body.vanityRedirect });
    }
  }

  const newguildData = await guild.findOne({ guildID: req.params.id });
  const guildName = req.app.get("client").guilds.cache.get(req.params.id).name;
  let updatedSettings = new MessageEmbed()
    .setTitle("Updated Guild Config")
    .addField("User", req.user.username, true)
    .addField("Guild", guildName, true)
    .setColor(EMBED_COLOR)
    .setTimestamp();
  req.app.get("client").channels.cache.get(CONTROL_CHANNEL_ID).send(updatedSettings);

  let data = {
    guild: req.params.id,
    user: req.user,
    prefix: newguildData.prefix,
    join_leave: newguildData.join_leave,
    event_logs: newguildData.event_logs,
    mute_role: newguildData.mute_role,
    rank_channel: newguildData.rank_channel,
    customStatsRole: newguildData.customStatsRole,
    vanityURL: newguildData.vanityURL,
    vanityRedirect: newguildData.vanityRedirect,
    autodeletechannel: newguildData.auto_delete_channel,
    autodeletekeyword: newguildData.auto_delete_keyword,
    discord: req.app.get("client"),
    discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
    isDeveloper: developer,
    savedChanges: true,
    vanity_in_use: vanity_in_use
  };
  res.render("dash/settings", data);
});

// Dashboard Premium Embed Generator
route.get("/:id/embed-generator", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");

  const guildData = await guild.findOne({ guildID: req.params.id });
  if (!guildData) return res.redirect("/invite");

  if (!guildData.is_premium) {
    let developer = false;
    if (req.user) {
      if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
    }
    let data = {
      user: req.user,
      isDeveloper: developer
    };
    return res.render("partials/error/invalid-premium", data);
  }

  let authedGuilds = [];

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  if (DEVELOPER_IDS.includes(req.user.id)) authedGuilds.push({ guildData });
  req.user.guilds.forEach((guild) => {
    if (guild.id == req.params.id) {
      if (!guild.permissions & map.MANAGE_GUILD) return next();

      authedGuilds.push(guildData);
    } else {
      return;
    }
  });
  if (authedGuilds.length == 0) return next();
  console.log(authedGuilds);

  let data = {
    guild: req.params.id,
    user: req.user,
    discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
    discord: req.app.get("client"),
    isDeveloper: developer,
    savedChanges: false,
    error: false
  };
  res.render("dash/embedGenerator", data);
});

// Dashboard Premium Embed Sending
route.post("/:id/embed-generator", async (req, res, next) => {
  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }
  const embed = new MessageEmbed();

  if (req.body.author) {
    embed.setAuthor(req.body.author);
  }

  if (req.body.authorThumbnailURL) {
    embed.setAuthor(req.body.author, req.body.authorThumbnailURL);
  }

  if (req.body.title) {
    embed.setTitle(req.body.title);
  }

  if (req.body.description) {
    embed.setDescription(req.body.description);
  }

  if (req.body.imageURL) {
    embed.setImage(req.body.imageURL);
  }

  if (req.body.thumbnailURL) {
    embed.setThumbnail(req.body.thumbnailURL);
  }

  if (req.body.color) {
    embed.setColor(req.body.color);
  }

  if (req.body.footer) {
    embed.setFooter(req.body.footer);
  }

  if (req.body.footerAvatarURL) {
    embed.setFooter(req.body.footer, req.body.footerAvatarURL);
  }

  embed.setTimestamp();

  try {
    req.app.get("client").channels.cache.get(req.body.channel).send(embed);
  } catch (err) {
    const savedChanges = false;
    const error = true;
    console.error(err);
    let data = {
      guild: req.params.id,
      user: req.user,
      discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
      isDeveloper: developer,
      savedChanges: savedChanges,
      error: error,
      discord: req.app.get("client"),
      err: err
    };
    return res.render("dash/embedGenerator", data);
  }

  const savedChanges = true;
  const error = false;

  let data = {
    guild: req.params.id,
    user: req.user,
    discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
    isDeveloper: developer,
    savedChanges: savedChanges,
    error: error,
    discord: req.app.get("client")
  };

  res.render("dash/embedGenerator", data);
});

// Dashboard Guild Infractions Search
route.get("/:id/infractions", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");

  let inf = await infractions.find({ GuildID: req.params.id });

  let authedGuilds = [];

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  if (DEVELOPER_IDS.includes(req.user.id)) authedGuilds.push({ inf });
  req.user.guilds.forEach((guild) => {
    if (guild.id == req.params.id) {
      if (!guild.permissions & map.MANAGE_GUILD) return next();

      authedGuilds.push(inf);
    } else {
      return;
    }
  });

  if (authedGuilds.length == 0) return next();
  let data = {
    guild: req.params.id,
    user: req.user,
    inf: inf,
    discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
    isDeveloper: developer
  };
  res.render("dash/infractions", data);
});

// Dashboard Guild Members Search
route.get("/:id/members", async (req, res, next) => {
  if (!req.user) return res.redirect("/login");

  const guildData = await guild.findOne({ guildID: req.params.id });
  if (!guildData) return res.redirect("/invite");

  let authedGuilds = [];

  if (DEVELOPER_IDS.includes(req.user.id)) authedGuilds.push({ guildData });

  let developer = false;
  if (req.user) {
    if (DEVELOPER_IDS.includes(req.user.id)) developer = true;
  }

  req.user.guilds.forEach((guild) => {
    if (guild.id == req.params.id) {
      if (!guild.permissions & map.MANAGE_GUILD) return next();

      authedGuilds.push(guildData);
    } else {
      return;
    }
  });

  if (authedGuilds.length == 0) return next();

  console.log(authedGuilds);
  let data = {
    guild: req.params.id,
    user: req.user,
    discord: req.app.get("client"),
    discord_guild: req.app.get("client").guilds.cache.get(req.params.id),
    isDeveloper: developer
  };
  res.render("dash/members", data);
});

// Define Route
module.exports = route;
