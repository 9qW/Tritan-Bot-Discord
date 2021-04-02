const { MessageEmbed, WebhookClient } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, shardID, error) => {
  console.log(chalk.yellowBright("[SHARD ERROR]"), `Shard ${shardID}: ${error}`);

  client.utils.sentry.captureException(error);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟡 **Shard ${shardID}** Error:`)
    .addField("Shard ID:", shardID)
    .addField("Error", error)
    .setColor(client.config.colors.EMBED_RATELIMIT_COLOR)
    .setTimestamp();

  const webhookClient = new WebhookClient(
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  );

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
    embeds: [reconnectEmbed]
  });
};
