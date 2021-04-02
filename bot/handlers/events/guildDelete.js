const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, guild) => {
  let embed = new MessageEmbed()
    .setAuthor(guild.name, guild.iconURL())
    .setTitle(`❌ Left Guild`)
    .addField(`Server Name:`, guild.name, false)
    .addField(`Guild ID:`, guild.id, false)
    .addField(`Guild Member Count:`, guild.memberCount, false)
    .addField(`Shard:`, guild.shardID, false)
    .setColor(client.config.colors.EMBED_GUILDDELETE_COLOR)
    .setTimestamp()
    .setFooter("Tritan Bot");

  const webhookClient = new WebhookClient(
    client.config.webhooks.BOT_JOINLEAVE_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.BOT_JOINLEAVE_CHANNEL_WEBHOOK_SECRET
  );

  webhookClient.send({
    username: "Tritan Bot",
    avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
    embeds: [embed]
  });
};
