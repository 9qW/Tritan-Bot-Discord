const { MessageEmbed, WebhookClient } = require("discord.js");
const mongoose = require("mongoose");

module.exports = async (client, messages) => {
  const message = messages.first();

  const settings = await client.models.guild.findOne({
    guildID: message.guild.id
  });

  if (!settings.event_logs || settings.event_logs === null) {
    return;
  }

  let embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle("🗑️ Bulk Delete:")
    .setDescription(`${messages.size} messages in ${message.channel} have been purged.`)
    .setColor(client.config.colors.EMBED_MSGDELETED_COLOR)
    .setTimestamp()
    .setFooter(`Member ID: ${message.author.id}`, message.guild.iconURL());

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
