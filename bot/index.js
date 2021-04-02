const { ShardingManager, MessageEmbed, WebhookClient } = require("discord.js");
const { CONTROL_CHANNEL_WEBHOOK_ID, CONTROL_CHANNEL_WEBHOOK_SECRET } = require("./config/webhooks");
const { TOKEN } = require("./config/tokens");
const { EMBED_COLOR } = require("./config/colors");
const { SHARD_COUNT } = require("./config/helpers");

const chalk = require("chalk");
const pingport = require("./helpers/pingport");
const statcord = require("./helpers/statcord");
const botlists = require("./helpers/botlists");

const webhookClient = new WebhookClient(CONTROL_CHANNEL_WEBHOOK_ID, CONTROL_CHANNEL_WEBHOOK_SECRET);

const shard = new ShardingManager("./uwu.js", {
  token: TOKEN,
  autoSpawn: true,
  totalShards: SHARD_COUNT
});

shard.on("shardCreate", async (shard) => {
  console.log(chalk.yellowBright("[SHARD LAUNCHED]"), `Shard ${shard.id} has launched.`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟢 **Shard ${shard.id}** has launched.`)
    .setColor(EMBED_COLOR)
    .setTimestamp();

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
    embeds: [reconnectEmbed]
  });
});

shard.on("message", async (shard, message) => {
  console.log(chalk.yellowBright(`[SHARD ${shard.id}]`), `${message._eval} : ${message._result}`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟢 **Shard ${shard.id}** has sent a message.`)
    .addField(`Message Eval`, message._eval, true)
    .addField(`Message Result`, message._result, true)
    .setColor(EMBED_COLOR)
    .setTimestamp();

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
    embeds: [reconnectEmbed]
  });
});

pingport.init();
statcord(shard);
botlists(shard);
shard.spawn();

