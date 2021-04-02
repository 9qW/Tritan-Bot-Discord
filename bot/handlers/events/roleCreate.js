const { MessageEmbed, WebhookClient } = require(`discord.js`);
const mongoose = require("mongoose");

module.exports = async (client, role) => {
  const settings = await client.models.guild.findOne({
    guildID: role.guild.id
  });

  if (!settings.event_logs || settings.event_logs === null) {
    return;
  }

  role.guild
    .fetchAuditLogs({
      type: "ROLE_CREATE",
      limit: 1
    })
    .then(async (audit) => {
      let user = audit.entries.first().executor;
      if (!user) return;
      let embed = new MessageEmbed()
        .setAuthor(role.guild.name, role.guild.iconURL())
        .setTitle("🆕 Role Created:")
        .addField(`Name:`, role.name, true)
        .addField(`Created by:`, user.tag + ` (${user.id})`, true)
        .addField(`Created At:`, role.createdAt, true)
        .addField(`Members`, role.members.size, true)
        .addField(`Position:`, role.position, true)
        .addField(`Managed?`, role.managed, true)
        .addField(`Mentionable?`, role.mentionable, true)
        .addField(`Hoisted?`, role.hoist, true)
        .addField(`Color:`, role.hexColor, true)
        .setColor(client.config.colors.EMBED_ROLECREATE_COLOR)
        .setTimestamp()
        .setFooter(`Role ID: ${role.id}`);

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
    });
};
