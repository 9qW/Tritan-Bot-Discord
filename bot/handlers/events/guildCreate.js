const { MessageEmbed, WebhookClient } = require("discord.js");
const mongoose = require("mongoose");

module.exports = async (client, guild) => {
  try {
    const owner = await client.users.fetch(guild.ownerID);
    const ownerEmbed = new MessageEmbed()
      .setAuthor("Tritan Bot", "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Welcome!")
      .setDescription(
        "Thank you for adding me to your server! I offer a wide variety of features, which you can explore in your guild by running `*help`. Our developers are always looking for something to do, so hop by our [support server](https://tritan.gg/support) with any questions or suggestions!"
      )
      .addField(
        "Premium Status:",
        "❌  This guild does not have premium enabled. If you would like to learn more, please visit the [dashboard](https://tritan.gg)."
      )
      .addField(
        "Configuration:",
        "Our easy to use dashboard makes it eaiser than ever to configure me to your servers needs! As long as you have the `MANAGE_GUILD` permission, visit the [dashboard](https://tritan.gg) to get going!"
      )
      .setColor(client.config.colors.EMBED_GUILDCREATE_COLOR)
      .setTimestamp()
      .setFooter("Made with 🥰 by Team Tritan");
    owner.send(ownerEmbed).catch(console.error);
  } catch (e) {
    console.error("GUILD_CREATE", e);
    client.utils.sentry.captureException(e);
  }

  const settings = await client.models.guild.findOne({
    guildID: guild.id
  });

  if (!settings) {
    const newGuild = new client.models.guild({
      _id: mongoose.Types.ObjectId(),
      guildID: guild.id,
      guildName: guild.name,
      guildCreated: guild.createdAt,
      prefix: client.config.helpers.DEFAULT_PREFIX,
      is_premium: false,
      is_blacklisted: false,
      event_logs: null,
      join_leave: null,
      mute_role: null,
      betaGuild: false,
      messageCount: 1,
      disabledBumpReminders: false,
      auto_delete_channel: null
    });
    newGuild
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  }

  let joinserverEmbed = new MessageEmbed()
    .setTitle(`✅ Joined Guild`)
    .addField(`Server Name:`, guild.name, false)
    .addField(`Guild ID:`, guild.id, false)
    .addField(`Guild Member Count:`, guild.memberCount, false)
    .addField(`Shard:`, guild.shardID, false)
    .setColor(client.config.colors.EMBED_GUILDCREATE_COLOR)
    .setTimestamp()
    .setFooter("Tritan Bot");

  const webhookClient = new WebhookClient(
    client.config.webhooks.BOT_JOINLEAVE_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.BOT_JOINLEAVE_CHANNEL_WEBHOOK_SECRET
  );

  webhookClient.send({
    username: "Tritan Bot",
    avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
    embeds: [joinserverEmbed]
  });
};
