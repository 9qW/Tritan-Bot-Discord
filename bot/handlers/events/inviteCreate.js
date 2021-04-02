const { MessageEmbed, WebhookClient } = require(`discord.js`);
const mongoose = require("mongoose");

module.exports = async (client, invite) => {
  const settings = await client.models.guild.findOne({
    guildID: invite.guild.id
  });

  if (!settings.event_logs || settings.event_logs === null) {
    return;
  }

  let embed = new MessageEmbed()
    .setAuthor(invite.inviter.tag, invite.inviter.avatarURL())
    .setTitle("🛎️ Invite Created")
    .addField("Code:", invite.code, true)
    .addField("Channel:", invite.channel.name, true)
    .addField("URL:", invite.url)
    .setColor(client.config.colors.EMBED_COLOR)
    .setTimestamp()
    .setFooter(`Inviter ID: ${invite.inviter.id}`);

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
