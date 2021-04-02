const { MessageEmbed, WebhookClient } = require(`discord.js`);
const mongoose = require("mongoose");

module.exports = async (client, channel) => {
  if (!channel.guild) return;

  const settings = await client.models.guild.findOne({
    guildID: channel.guild.id
  });

  if (!settings.event_logs || settings.event_logs === null) {
    return;
  }

  channel.guild
    .fetchAuditLogs({
      type: "CHANNEL_DELETE",
      limit: 1
    })
    .then(async (audit) => {
      let user = audit.entries.first().executor;
      if (!user) return;

      let embed = new MessageEmbed()
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .setTitle("❎ Channel Deleted:")
        .addField("Name:", channel.name, true)
        .addField("Deleted by:", `${user.tag} (${user.id})`, true)
        .setColor(client.config.colors.EMBED_CHDELETE_COLOR)
        .setTimestamp()
        .setFooter(`Channel ID: ${channel.id}`);

      const thisWebhook = await client.models.webhooks.findOne({
        guildID: settings.guildID,
        channelID: settings.event_logs
      });

      if (thisWebhook) {
        const webhookClient = new WebhookClient(thisWebhook.webhookID, thisWebhook.webhookSecret);

        try {
          return await webhookClient.send({
            username: "Tritan Bot",
            avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
            embeds: [embed]
          });
        } catch (e) {
          await client.models.webhooks.findOneAndDelete({
            guildID: settings.guildID,
            channelID: settings.event_logs
          });
        }
      }
    });
};
