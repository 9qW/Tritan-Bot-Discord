const { MessageEmbed } = require(`discord.js`);
const mongoose = require("mongoose");

module.exports = {
  name: `kick`,
  description: `Kick Mentioned User`,
  usage: "<mention|id> <Reason>",
  async execute(message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      return message
        .reply("you don\t have enough permission to kick this member.")
        .then((m) => m.delete({ timeout: 5000 }));
    }
    let target = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );

    if (!target)
      return message
        .reply("you need to tag a user or enter their ID to kick them.")
        .then((m) => m.delete({ timeout: 5000 }));

    if (!target === message.author) {
      message.reply("i'll ignore that, this time...").then((m) => m.delete({ timeout: 5000 }));
    }
    let reason = args.join(" ");

    if (!reason)
      return message.reply("you need to specify a reason.").then((m) => m.delete({ timeout: 5000 }));

    if (!message.member.hasPermission("KICK_MEMBERS")) {
      return message
        .reply("you don\t have enough permission to kick this member.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    let userEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`🥾 You have been kicked!`)
      .setColor(message.client.config.colors.EMBED_KICK_COLOR)
      .setThumbnail(target.user.avatarURL)
      .addField("Moderator:", `${message.author.tag} (${message.author.id})`)
      .addField("Time:", message.createdAt)
      .addField("Channel:", message.channel)
      .addField("Reason:", reason)
      .setTimestamp(new Date())
      .setFooter(`${message.guild.name}`, message.guild.iconURL());

    try {
      target.send(userEmbed);
    } catch (error) {
      message.client.utils.sentry.captureException(error);
      message.reply("Unable to dm this specific member... kicking.").then((m) => m.delete({ timeout: 5000 }));
    }

    try {
      message.guild.member(target).kick(reason);
    } catch (error) {
      message.client.utils.sentry.captureException(error);
      message
        .reply("I was unable to kick this member, something weird must be going on.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    const settings = await message.client.models.guild.findOne(
      {
        guildID: message.guild.id
      },
      async (err, settings) => {
        if (err) console.error(err);
        if (err) message.client.utils.sentry.captureException(err);

        if (settings.event_logs == null) {
          return message
            .reply("you need to set a logging channel before using any moderation commands.")
            .then((m) => m.delete({ timeout: 5000 }));
        }

        let logEmbed = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle(`🥾 Member Kicked:`)
          .setColor(message.client.config.colors.EMBED_KICK_COLOR)
          .setThumbnail(target.user.avatarURL)
          .addField("Member:", `${target.user.tag} (ID: ${target.user.id})`)
          .addField("Moderator:", `${message.author.tag} (ID: ${message.author.id})`)
          .addField("Time:", message.createdAt)
          .addField("Channel:", message.channel)
          .addField("Reason:", reason)
          .setTimestamp()
          .setFooter(`${message.guild.name}`, message.guild.iconURL());
        const log_channel = await message.client.channels.fetch(settings.event_logs);
        log_channel.send(logEmbed);
        message.channel.send(logEmbed).then((m) => m.delete({ timeout: 5000 }));
      }
    );

    const newInfraction = new message.client.models.infractions({
      _id: mongoose.Types.ObjectId(),
      GuildID: message.guild.id,
      GuildName: message.guild.name,
      TargetID: target.user.id,
      TargetTag: target.user.tag,
      ModeratorID: message.author.id,
      ModeratorTag: message.author.tag,
      InfractionType: "Kick",
      Reason: reason,
      Time: message.createdAt
    });
    newInfraction
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  }
};
