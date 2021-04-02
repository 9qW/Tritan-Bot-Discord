const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "setprefix",
  description: "Change the default prefix to something you select!",
  usage: "(Prefix)setprefix [new prefix]",

  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      let noPerms = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Change Prefix:")
        .setDescription("You are not allowed or do not have permission to change the prefix.")
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
            prefix: message.client.config.helpers.DEFAULT_PREFIX
          });
          newGuild
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          return message.channel
            .send("This server was not in our database! We have added it, please retype this command.")
            .then((m) => m.delete({ timeout: 10000 }));
        }
      }
    );

    if (args.length < 1) {
      let SetPrefix = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Change Prefix")
        .setDescription(
          `You must specify a prefix to set for this server! Your current server prefix is \`${settings.prefix}\``
        )
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(SetPrefix);
    }

    await settings.updateOne({
      prefix: args[0]
    });

    let SetPrefix = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Change Prefix")
      .setDescription(`The prefix has been set to \`${args[0]}\``)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    await message.channel.send(SetPrefix);
  }
};
