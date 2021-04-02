const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, member) => {
  const settings = await client.models.guild.findOne({
    guildID: member.guild.id
  });

  if (!settings.join_leave || settings.join_leave === null) {
    return;
  }

  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_KICK"
  });

  const kickLog = fetchedLogs.entries.first();
  if (!kickLog) return;
  const { executor, target } = kickLog;

  if (kickLog.createdAt < member.joinedAt) {
    const leaveEmbed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle("🏃💨 Member Left:")
      .setDescription("`" + member.user.tag + "` has left the server.")
      .setColor(client.config.colors.EMBED_LEAVE_COLOR)
      .setFooter("Member ID: " + member.user.id)
      .setTimestamp();

    const thisWebhook = await client.models.webhooks.findOne({
      guildID: settings.guildID,
      channelID: settings.join_leave
    });

    if (thisWebhook) {
      const webhookClient = new WebhookClient(thisWebhook.webhookID, thisWebhook.webhookSecret);

      try {
        return await webhookClient.send({
          username: "Tritan Bot",
          avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
          embeds: [leaveEmbed]
        });
      } catch {
        return await client.models.webhooks.findOneAndDelete({
          guildID: settings.guildID,
          channelID: settings.join_leave
        });
      }
    }
  }

  if (target.id === member.id) {
    const leaveEmbed2 = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle("🏃💨 Member Left:")
      .setDescription(
        "`" + member.user.tag + "` was kicked from the server, check the mod-logs for more info."
      )
      .setColor(client.config.colors.EMBED_LEAVE_COLOR)
      .setFooter("Member ID: " + member.user.id)
      .setTimestamp();

    const thisWebhook2 = await client.models.webhooks.findOne({
      guildID: settings.guildID,
      channelID: settings.join_leave
    });

    if (thisWebhook2) {
      const webhookClient = new WebhookClient(thisWebhook2.webhookID, thisWebhook2.webhookSecret);

      try {
        return await webhookClient.send({
          username: "Tritan Bot",
          avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
          embeds: [leaveEmbed2]
        });
      } catch {
        return await client.models.webhooks.findOneAndDelete({
          guildID: settings.guildID,
          channelID: settings.join_leave
        });
      }
    }

    if (executor.tag === "Tritan Bot#5160") return;

    if (!settings.event_logs || settings.event_logs === null) {
      return;
    }

    const kickEmbed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle("🥾 Member Kicked:")
      .addField("Member:", member.user.tag)
      .addField("Moderator:", executor.tag)
      .setColor(client.config.colors.EMBED_KICK_COLOR)
      .setFooter("Member ID: " + member.user.id)
      .setTimestamp();

    const thisWebhook3 = await client.models.webhooks.findOne({
      guildID: settings.guildID,
      channelID: settings.event_logs
    });

    if (thisWebhook3) {
      const webhookClient = new WebhookClient(thisWebhook3.webhookID, thisWebhook3.webhookSecret);

      try {
        return await webhookClient.send({
          username: "Tritan Bot",
          avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
          embeds: [kickEmbed]
        });
      } catch {
        return await client.models.webhooks.findOneAndDelete({
          guildID: settings.guildID,
          channelID: settings.event_logs
        });
      }
    }
  }
};
