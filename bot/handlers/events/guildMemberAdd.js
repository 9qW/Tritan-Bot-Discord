const { MessageEmbed, WebhookClient } = require("discord.js");
const mongoose = require("mongoose");

module.exports = async (client, member) => {
  const settings = await client.models.guild.findOne({
    guildID: member.guild.id
  });

  if (!settings.join_leave || settings.join_leave === null) {
    return;
  }

  if (Date.now() - member.user.createdAt < 1000 * 60 * 60 * 24 * 10) {
    const embed2 = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle("⚠️ User Warning:")
      .setDescription(
        "`" + member.user.tag + "` has joined the server, but their account was made less than 10 days ago."
      )
      .addField(`Account Created:`, member.user.createdAt)
      .setColor("YELLOW")
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
          embeds: [embed]
        });
      } catch {
        return;
      }
    }
  } else {
    const embed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle("Member Joined:")
      .setDescription("`" + member.user.tag + "` has joined the server.")
      .setColor(client.config.colors.EMBED_JOIN_COLOR)
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
          embeds: [embed]
        });
      } catch {
        return await client.models.webhooks.findOneAndDelete({
          guildID: settings.guildID,
          channelID: settings.join_leave
        });
      }
    }
  }
};
