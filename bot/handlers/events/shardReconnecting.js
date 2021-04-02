const { MessageEmbed, WebhookClient } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, id) => {
  console.log(chalk.yellowBright("[SHARD RECONNECTING]"), `Shard ${id} is reconnecting.`);
  
  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟡 **Shard ${id}** Reconnecting.`)
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
