const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "autodeletedisable",
  description: "Disable auto deletion of messages in a channel.",
  usage: "(Prefix)autodeletedisable",

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
    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    if (settings.auto_delete_channel) {
      await settings.updateOne({ auto_delete_channel: null });
    }

    let disabled = new MessageEmbed()
      .setAuthor(
        `Tritan Bot`,
        "https://cdn.discordapp.com/attachments/732766998345285712/744305778399117476/8bd897f7fce9469a670f494768f21dec.jpg"
      )
      .setTitle("Auto Deletion Disabled")
      .setDescription(`The auto deletion channel has been disabled for this guild.`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(disabled);
  }
};
