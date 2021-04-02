const { MessageEmbed, splitMessage, WebhookClient } = require("discord.js");

module.exports = async (client, oldMember, newMember) => {
  const settings = await client.models.guild.findOne(
    {
      guildID: newMember.guild.id
    },
    (err, guild) => {
      if (err) console.error(err);
      if (!guild) {
        return;
      }
    }
  );

  if (settings.event_logs === null || !settings.event_logs) {
    return;
  }

  if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      let dif = oldMember.roles.cache.filter((r) => !newMember.roles.cache.has(r.id)).first();
      const embed = new MessageEmbed()
        .setAuthor(newMember.user.tag, newMember.user.avatarURL())
        .setTitle(`🎈 Role Removed: ${dif.name}`)
        .setColor(client.config.colors.EMBED_ROLE_COLOR)
        .setDescription(`**Some Roles:** ${newMember.roles.cache.map((role) => role).join(", ")}`)
        .setFooter(`Member ID: ${newMember.user.id}`)
        .setTimestamp();

      const splitDescription = splitMessage(embed.description, {
        maxLength: 2048,
        char: "\n",
        prepend: "",
        append: ""
      });

      splitDescription.forEach(async (m) => {
        embed.setDescription(m);

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
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
      let dif = newMember.roles.cache.filter((r) => !oldMember.roles.cache.has(r.id)).first();
      const embed2 = new MessageEmbed()
        .setColor(client.config.colors.EMBED_ROLE_COLOR)
        .setAuthor(newMember.user.tag, newMember.user.avatarURL())
        .setTitle(`🎈 Role Added: ${dif.name}`)
        .setDescription(`**Some Roles:** ${newMember.roles.cache.map((role) => role).join(", ")}`)
        .setFooter(`Member ID: ${newMember.user.id}`)
        .setTimestamp();

      const splitDescription = splitMessage(embed2.description, {
        maxLength: 2048,
        char: "\n",
        prepend: "",
        append: ""
      });

      splitDescription.forEach(async (m) => {
        embed2.setDescription(m);

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
              embeds: [embed2]
            });
          } catch {
            return await client.models.webhooks.findOneAndDelete({
              guildID: settings.guildID,
              channelID: settings.event_logs
            });
          }
        }
      });
    }
  }
};
