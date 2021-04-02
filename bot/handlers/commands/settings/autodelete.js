const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "autodelete",
  description: "Change the default prefix to something you select!",
  usage: "(Prefix)autodelete",

  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      let noPerms = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Set Auto Deletion:")
        .setDescription("You are not allowed or do not have permission to set the logging channel.")
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(noPerms).then((m) => m.delete({ timeout: 10000 }));
    }

    const settings = await message.client.models.guild.findOne(
      {
        guildID: message.guild.id
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new message.client.models.guild({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            guildCreated: message.guild.createdAt,
            guildIcon: message.guild.iconURL(),
            prefix: message.client.config.helpers.DEFAULT_PREFIX,
            is_premium: false,
            is_blacklisted: false,
            event_logs: null,
            join_leave: null,
            auto_delete_channel: message.channel.id
          });
          newGuild
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          let SetCH = new MessageEmbed()
            .setAuthor(
              `Tritan Bot`,
              "https://cdn.discordapp.com/attachments/732766998345285712/744305778399117476/8bd897f7fce9469a670f494768f21dec.jpg"
            )
            .setTitle("Auto Deletion Channel Set:")
            .setDescription(
              `The auto deletion channel has been set to <#${message.channel.id}> (${message.channel.name}).`
            )
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
          return message.channel.send(SetCH);
        }
      }
    );

    await settings.updateOne({
      auto_delete_channel: message.channel.id
    });

    let SetCH = new MessageEmbed()
      .setAuthor(
        `Tritan Bot`,
        "https://cdn.discordapp.com/attachments/732766998345285712/744305778399117476/8bd897f7fce9469a670f494768f21dec.jpg"
      )
      .setTitle("Auto Deletion Channel Updated:")
      .setDescription(
        `The auto deletion channel has been set to <#${message.channel.id}> (${message.channel.name}).`
      )
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(SetCH);
  }
};
