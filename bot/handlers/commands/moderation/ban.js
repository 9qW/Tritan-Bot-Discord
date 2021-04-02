const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ban",
  async execute(message, args) {
    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    const user = message.mentions.users.first() || (await message.client.users.fetch(args[0]));
    if (!user) return await message.channel.send("Unable to find a user with this ID.");

    const reason = args.slice(1).join(" ") || "No reason provided.";

    try {
      let logEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`🥾 Member Banned:`)
        .setColor(message.client.config.colors.EMBED_BANADD_COLOR)
        .addField("Member:", `${user.username}#${user.discriminator} (ID: ${user.id})`)
        .addField("Moderator:", `${message.author.tag} (ID: ${message.author.id})`)
        .addField("Time:", message.createdAt)
        .addField("Channel:", message.channel)
        .addField("Reason:", reason)
        .setTimestamp()
        .setFooter(`${message.guild.name}`, message.guild.iconURL());
      user.send(logEmbed);
    } catch (error) {
      message.reply(`I couldn't dm this member, banning...`);
    }

    try {
      await message.guild.members.ban(user, { reason: reason });

      const newInfraction = new message.client.models.infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: message.guild.id,
        GuildName: message.guild.name,
        TargetID: user.id,
        TargetTag: user.username + "#" + user.discriminator,
        ModeratorID: message.author.id,
        ModeratorTag: message.author.tag,
        InfractionType: "Ban",
        Reason: reason,
        Time: message.createdAt
      });
      newInfraction.save().then((result) => console.log(result));
    } catch (error) {
      message.reply(`I couldn't ban this member, or save their infraction to the database.`, error);
    }

    if (settings.event_logs) {
      let logEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`🥾 Member Banned:`)
        .setColor(message.client.config.colors.EMBED_BANADD_COLOR)
        .addField("Member:", `${user.username}#${user.discriminator} (ID: ${user.id})`)
        .addField("Moderator:", `${message.author.tag} (ID: ${message.author.id})`)
        .addField("Time:", message.createdAt)
        .addField("Channel:", message.channel)
        .addField("Reason:", reason)
        .setTimestamp()
        .setFooter(`${message.guild.name}`, message.guild.iconURL());
      const log_channel = await message.client.channels.fetch(settings.event_logs);
      log_channel.send(logEmbed);
    }

    let logEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`🥾 Member Banned:`)
      .setColor(message.client.config.colors.EMBED_BANADD_COLOR)
      .addField("Member:", `${user.username}#${user.discriminator} (ID: ${user.id})`)
      .addField("Moderator:", `${message.author.tag} (ID: ${message.author.id})`)
      .addField("Time:", message.createdAt)
      .addField("Channel:", message.channel)
      .addField("Reason:", reason)
      .setTimestamp()
      .setFooter(`${message.guild.name}`, message.guild.iconURL());
    message.channel.send(logEmbed).then((m) => m.delete({ timeout: 5000 }));
  }
};
