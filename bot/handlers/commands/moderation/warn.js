const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "warn",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.reply("you don\t have enough permission to warn this member.");
    }

    let target = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );

    let reason = args.slice(1).join(" ");

    if (!target) return message.reply("please specify a member to warn.");
    if (!reason) return message.reply("please specify a reason for this warning.");

    const settings = await message.client.models.guild.findOne(
      {
        guildID: message.guild.id
      },
      async (err, settings) => {
        if (settings.event_logs == null) {
          return message.reply("you need to set a logging channel before using any moderation commands.");
        }

        if (err) console.error(err);
        if (err) message.client.utils.sentry.captureException(err);

        let embed = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle(`🚨 Member Warning:`)
          .setColor(message.client.config.colors.EMBED_BANADD_COLOR)
          .setThumbnail(target.user.avatarURL)
          .addField("Member:", `${target.user.tag} (ID: ${target.user.id})`)
          .addField("Moderator:", `${message.author.tag} (ID: ${message.author.id})`)
          .addField("Time:", message.createdAt)
          .addField("Channel:", message.channel)
          .addField("Reason:", reason)
          .setTimestamp()
          .setFooter(`${message.guild.name}`, message.guild.iconURL());
        try {
          target.send(embed);
        } catch (err) {
          message.client.utils.sentry.captureException(err);
          console.error(err);
          message
            .reply("I was unable to dm this member, warning...")
            .then((m) => m.delete({ timeout: 5000 }));
        }
        const log_channel = await message.client.channels.fetch(settings.event_logs);
        log_channel.send(embed);
        message.channel.send(embed).then((m) => m.delete({ timeout: 5000 }));
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
      InfractionType: "Warning",
      Reason: reason,
      Time: message.createdAt
    });
    newInfraction
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  }
};
