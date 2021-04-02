const { MessageEmbed, WebhookClient } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, event) => {
  console.log(chalk.yellowBright("[SHARD DISCONENCTED]"), `Shard ${event} has disconnected.`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🔴 **Shard ${event}** has disconnected.`)
    .setColor(client.config.colors.EMBED_COLOR)
    .setTimestamp();

  const webhookClient = new WebhookClient(
    client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_SECRET
  );

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
    embeds: [reconnectEmbed]
  });
};
