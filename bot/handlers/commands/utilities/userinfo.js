const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  usage: "(Prefix)userinfo [mention]",
  description: "View someone else's profile card!",
  async execute(message, args) {
    const member =
      message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let target = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!member)
      return message.reply(
        "you need to specify which member by mention or ID. If you've already done so, this user is no longer in the guild as I can't access their data."
      );

    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, fetching user info from the API.`
    );
    const waiting2 = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, fetching user roles and permissions from the API.`
    );

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("User Info:")
      .setDescription(`[Avatar URL](${target.displayAvatarURL()})`)
      .setThumbnail(target.avatarURL())
      .addField("Username:", "<@" + target.id + ">", true)
      .addField("Nickname:", member.displayName, true)
      .addField("User ID:", target.id, true)
      .addField("Account Created:", target.createdAt, true)
      .addField("Joined Guild:", member.joinedAt, true)
      .addField(
        "Voice:",
        member.voice.channel
          ? member.voice.channel.name + ` (${member.voice.channel.id})`
          : "Not currently in a voice channel.",
        true
      )
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    let roleEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("User Roles & Permissions:")
      .addField("Some Roles:", member.roles.cache.map((role) => role).join(", "), false)
      .addField("Permissions:", [
        `${member.permissions
          .toArray()
          .map((x) =>
            x
              .split("_")
              .map((y) => y[0] + y.slice(1).toLowerCase())
              .join(" ")
          )
          .join(", ")}`
      ])
      .setThumbnail(target.avatarURL())
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    waiting.edit(null, embed);
    waiting2.edit(null, roleEmbed);
  }
};
