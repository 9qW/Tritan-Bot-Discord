const { MessageEmbed, WebhookClient } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, guild) => {
  console.log(chalk.yellowBright("[GUILD UNAVAILABLE]"), `${guild.name} (ID: ${guild.id})`);
  let reconnectEmbed = new MessageEmbed()
    .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
    .setTitle(`👻 Guild Unavaliable`)
    .addField("Guild Name:", guild.name)
    .addField("Guild ID", guild.id)
    .setColor(client.config.colors.EMBED_RATELIMIT_COLOR)
    .setTimestamp();

  const webhookClient = new WebhookClient(
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  );

  await webhookClient.send({
    username: "Tritan Errors",
    avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
    embeds: [reconnectEmbed]
  });
};
