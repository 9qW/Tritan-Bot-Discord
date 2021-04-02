const { MessageEmbed, WebhookClient } = require(`discord.js`);
const mongoose = require("mongoose");

module.exports = async (client, guild, user) => {
  const settings = await client.models.guild.findOne({
    guildID: guild.id
  });

  if (!settings.event_logs || settings.event_logs === null) {
    return;
  }

  let fetchedLogs = await guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_BAN_REMOVE"
  });

  const banLog = fetchedLogs.entries.first();
  if (!banLog) return;
  const { executor, target } = banLog;

  let embed = new MessageEmbed()
    .setAuthor(user.tag, user.avatarURL())
    .setTitle("🔨 Member Unbanned:")
    .addField("Member:", user.tag)
    .addField("Moderator:", executor.tag)
    .setColor(client.config.colors.EMBED_BANRMV_COLOR)
    .setTimestamp()
    .setFooter(`Member ID: ${user.id}`);

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
    } catch {
      return await client.models.webhooks.findOneAndDelete({
        guildID: settings.guildID,
        channelID: settings.event_logs
      });
    }
  }
};
