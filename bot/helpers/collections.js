const { Collection } = require("discord.js");

module.exports = (client) => {
  client.commands = new Collection();
  client.cooldowns = new Collection();
  
  client.queue = new Map();
  client.snipes = new Map();

  client.utils = [];
  client.utils.copypastas = require("../utils/copypastas");

  client.config = [];
  client.config.tokens = require("../config/tokens");
  client.config.webhooks = require("../config/webhooks");
  client.config.helpers = require("../config/helpers");
  client.config.colors = require("../config/colors");

  client.models = [];
  client.models.commands = require("../models/commands");
  client.models.economy = require("../models/economy");
  client.models.guild = require("../models/guild");
  client.models.infractions = require("../models/infractions");
  client.models.messages = require("../models/messages");
  client.models.reminders = require("../models/reminders");
  client.models.webhooks = require("../models/webhooks");
};
