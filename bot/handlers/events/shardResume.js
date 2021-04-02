const { MessageEmbed, WebhookClient } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, id, replayedEvents) => {
  console.log(chalk.yellowBright("[SHARD RESUMED]"), `Shard ${id} has resumed.`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟢 **Shard ${id}** has resumed.`)
    .addField("Replayed Events:", replayedEvents)
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
