const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "muterole",
  description: "Change the default prefix to something you select!",
  usage: "(Prefix)setprefix [new prefix]",

  async execute(message, args) {
    if (!args[0]) return message.channel.send("You need to tag your mute role when running this command.");
    const role = message.mentions.roles.first().id || message.guild.roles.cache.get(args[0]);

    if (!message.member.hasPermission("MANAGE_GUILD")) {
      let noPerms = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Set Mute Role:")
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
            mute_role: role
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
            .setTitle("Mute Role Set:")
            .setDescription(`The mute role has been set to <@&${role}>.`)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
          return message.channel.send(SetCH);
        }
      }
    );

    await settings.updateOne({
      mute_role: role
    });

    let SetCH = new MessageEmbed()
      .setAuthor(
        `Tritan Bot`,
        "https://cdn.discordapp.com/attachments/732766998345285712/744305778399117476/8bd897f7fce9469a670f494768f21dec.jpg"
      )
      .setTitle("Mute Role Updated:")
      .setDescription(`The mute role has been set to <@&${role}>.`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(SetCH);
  }
};
