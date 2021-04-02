const { MessageEmbed, WebhookClient } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, error) => {
  console.log(chalk.yellowBright("[ERROR]"), `${error}`);
  client.utils.sentry.captureException(error);

  let embed = new MessageEmbed()
    .setTitle(`⚠️ Error:`)
    .addField("Error", error)
    .setColor(client.config.colors.EMBED_RATELIMIT_COLOR)
    .setTimestamp();

  const webhookClient = new WebhookClient(
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  );

  await webhookClient.send({
    username: "Tritan Errors",
    avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
    embeds: [embed]
  });
};
