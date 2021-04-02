const { MessageEmbed, WebhookClient } = require("discord.js");
const mongoose = require("mongoose");

module.exports = async (client, message, editedMessage) => {
  if (!message.guild) return;

  const settings = await client.models.guild.findOne({
    guildID: message.guild.id
  });

  if (!settings.event_logs || settings.event_logs === null) {
    return;
  }

  if (message.author.bot) return;
  if (message === editedMessage) return;
  if (message.channel.type !== "text") return;

  let guild = message.guild;
  const embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle(`📝 Edited Message:`)
    .setColor(client.config.colors.EMBED_MSGUPDATE_COLOR)
    .addField("Author:", `${message.author.tag}`, true)
    .addField(`Channel:`, "<#" + message.channel.id + ">" + ` (` + message.channel.name + `)`, true)
    .addField("Before:", `${message}`, false)
    .addField("After:", `${editedMessage}`, false)
    .setTimestamp()
    .setFooter("Member ID: " + message.author.id);

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
