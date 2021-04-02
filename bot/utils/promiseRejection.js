const { WebhookClient, MessageEmbed } = require("discord.js");
const chalk = require("chalk");

module.exports = (process, client) => {
  const webhookClient = new WebhookClient(
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  );

  process.on("unhandledRejection", (error) => {
    console.error(chalk.redBright("[Unhandled Rejection]"), error);

    client.utils.sentry.captureException(error);

    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Unhandled Promise Rejection:")
      .setColor("#FF0000")
      .setTimestamp()
      .addFields(
        {
          name: "Name",
          value: error.name,
          inline: true
        },
        {
          name: "Error Message",
          value: error.message
        }
      );

    webhookClient
      .send({
        username: "Tritan Errors",
        avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
        embeds: [embed]
      })
      .catch(console.error);
  });
};
