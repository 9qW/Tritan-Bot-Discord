const discord = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "unmute",
  async execute(message, args, client) {
    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    if (!settings.mute_role) {
      return message.reply("this guild needs to setup a mute role before using this command.");
    }

    if (!message.member.hasPermission("ADMINISTRATOR") || !message.member.hasPermission("MUTE_MEMBERS"))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle("Missing Permissions")
          .setColor(message.client.config.colors.EMBED_COLOR)
          .setDescription(
            "You don't have the permission to mute members, please check the discord permissions and try again."
          )
      );

    if (!message.guild.me.hasPermission("MANAGE_ROLES"))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle("Missing Permissions")
          .setColor(message.client.config.colors.EMBED_COLOR)
          .setDescription(
            "**I** don't have the permission to manage roles, therefore I am unable to unmute this member."
          )
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp()
      );

    const mutedUser = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );

    const mutedRole = message.guild.roles.cache.find((role) => role.id === settings.mute_role);

    if (!mutedUser) return message.channel.send("Please provide a valid user mention.");

    if (!mutedUser.roles.cache.some((role) => role.id == settings.mute_role))
      return message.channel.send("The mentioned member is not currently muted.");

    let embed = new discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(":loud_sound: User Unmuted:")
      .addField("Guild", message.guild.name, true)
      .addField("Member", mutedUser.user.tag + ` (ID: ${mutedUser.id})`, true)
      .addField("Moderator", message.author.tag + ` (ID: ${message.author.id})`, true)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Member ID: ${message.author.id}`, message.guild.iconURL())
      .setTimestamp();

    try {
      mutedUser.send(embed);
    } catch (error) {
      message.reply("Error, unable to dm this user, unmuting...", error);
    }

    try {
      mutedUser.roles.remove(mutedRole);
    } catch (error) {
      return message.reply("Error, unable to unmute this user.", error);
    }

    message.channel.send(embed);
    try {
      const log_channel = await message.client.channels.fetch(settings.event_logs);
      log_channel.send(embed);
    } catch (error) {
      console.log(error);
    }

    const newInfraction = new message.client.models.infractions({
      _id: mongoose.Types.ObjectId(),
      GuildID: message.guild.id,
      GuildName: message.guild.name,
      TargetID: mutedUser.user.id,
      TargetTag: mutedUser.user.tag,
      ModeratorID: message.author.id,
      ModeratorTag: message.author.tag,
      InfractionType: "Unmute",
      Reason: "Unmuted Manually",
      Time: message.createdAt
    });
    newInfraction
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  }
};
