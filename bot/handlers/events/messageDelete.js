const { MessageEmbed, WebhookClient } = require(`discord.js`);
const mongoose = require("mongoose");

module.exports = async (client, message) => {
  if (!message.guild) return;

  client.snipes.set(message.channel.id, {
    author: message.author.tag,
    author_id: message.author.id,
    author_avatar: message.author.displayAvatarURL(),
    content: message.content || "No message content recorded, this was most likely a bot embed.",
    channel: message.channel.name,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null
  });

  const settings = await client.models.guild.findOne({
    guildID: message.guild.id
  });

  if (!settings.event_logs || settings.event_logs === null) {
    return;
  }

  if (!message.content) return;
  if (!message.channel) return;
  if (!message.author) return;
  if (!message.id) return;

  let embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle("🗑️ Deleted Message:")
    .addField("Author:", `${message.author.tag} (${message.author.id})`, true)
    .addField(`Channel:`, "<#" + message.channel.id + ">" + " (" + message.channel.name + ")", true)
    .addField("Message:", message.content)
    .setColor(client.config.colors.EMBED_MSGDELETED_COLOR)
    .setTimestamp()
    .setFooter(`Message ID: ${message.id}`);

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
