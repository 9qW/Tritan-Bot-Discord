const { Client } = require("discord.js");
const glob = require("glob");

const collections = require("./helpers/collections");
const giveaways = require("./helpers/giveaways");
const starboards = require("./helpers/starboards");
const db = require("./helpers/database");
const sentry = require("./utils/sentry");
const promiseRejection = require("./utils/promiseRejection");

const client = new Client({
  disableMentions: "everyone",
  rateLimitAsError: true,
  compress: true,
  restTimeOffset: 0,
  fetchAllMembers: true,
  fetchAllRoles: true
});

collections(client);
giveaways(client);
starboards(client);
db(client);
sentry(client);
promiseRejection(process, client);

const commandFiles = glob.sync("./handlers/commands/**/*.js");
for (const file of commandFiles) {
  const command = require(file);
  client.commands.set(command.name, command);
}

const eventFiles = glob.sync("./handlers/events/*.js");
for (const file of eventFiles) {
  const event = require(file);
  const eventName = /\/events.(.*).js/.exec(file)[1];
  client.on(eventName, event.bind(null, client));
}

client.login(client.config.tokens.TOKEN);
