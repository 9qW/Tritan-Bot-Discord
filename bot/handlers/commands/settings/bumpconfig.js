const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "bumpconfig",
  usage: "(Prefix)bumpconfig",
  premium: true,
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      let noPerms = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Disable Bump Reminders")
        .setDescription("You are not allowed or do not have permission to set this configuration.")
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(noPerms).then((m) => m.delete({ timeout: 10000 }));
    }

    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    if (!settings.disabledBumpReminders) {
      await settings.updateOne({
        disabledBumpReminders: true
      });

      let owo = new MessageEmbed()
        .setAuthor(
          `Tritan Bot`,
          "https://cdn.discordapp.com/attachments/732766998345285712/744305778399117476/8bd897f7fce9469a670f494768f21dec.jpg"
        )
        .setTitle("Auto bump reminders have been disabled.")
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(owo);
    }

    if (settings.disabledBumpReminders) {
      await settings.updateOne({
        disabledBumpReminders: false
      });

      let owo = new MessageEmbed()
        .setAuthor(
          `Tritan Bot`,
          "https://cdn.discordapp.com/attachments/732766998345285712/744305778399117476/8bd897f7fce9469a670f494768f21dec.jpg"
        )
        .setTitle("Auto bump reminders have been enabled.")
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(owo);
    }
  }
};
