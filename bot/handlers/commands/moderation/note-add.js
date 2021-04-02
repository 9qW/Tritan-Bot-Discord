const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "note-add",
  aliases: ["add-note"],
  async execute(message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      return message.reply("you don\t have enough permission to add a note to this member.");
    }

    let target = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );

    let reason = args.slice(1).join(" ");

    if (!target) return message.reply("Unable to find this user, are they in your guild?");
    if (!reason) return message.reply("please specify a reason for this note.");

    const settings = await message.client.models.guild.findOne(
      {
        guildID: message.guild.id
      },
      async (err, settings) => {
        if (err) console.error(err);
        if (err) message.client.utils.sentry.captureException(err);

        if (settings.event_logs == null) {
          return message.reply("you need to set a logging channel before using any moderation commands.");
        }

        try {
          const newInfraction = new message.client.models.infractions({
            _id: mongoose.Types.ObjectId(),
            GuildID: message.guild.id,
            GuildName: message.guild.name,
            TargetID: target.user.id,
            TargetTag: target.user.tag,
            ModeratorID: message.author.id,
            ModeratorTag: message.author.tag,
            InfractionType: "Note",
            Reason: reason,
            Time: message.createdAt
          });
          newInfraction.save().then((result) => console.log(result));
        } catch (err) {
          message.client.utils.sentry.captureException(err);
          console.error(err);
          return message
            .reply("I was unable to save a note for this user, they may not be in your guild at this time.")
            .then((m) => m.delete({ timeout: 5000 }));
        }

        let embed = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle(`📝 Note Added:`)
          .setColor(message.client.config.colors.EMBED_NOTEADD_COLOR)
          .setThumbnail(target.user.avatarURL)
          .addField("Member:", `${target.user.tag} (ID: ${target.user.id})`)
          .addField("Moderator:", `${message.author.tag} (ID: ${message.author.id})`)
          .addField("Time:", message.createdAt)
          .addField("Channel:", message.channel)
          .addField("Note:", reason)
          .setTimestamp()
          .setFooter(`${message.guild.name}`, message.guild.iconURL());
        const log_channel = await message.client.channels.fetch(settings.event_logs);
        log_channel.send(embed);
        return message.channel.send(embed).then((m) => m.delete({ timeout: 5000 }));
      }
    );
  }
};
