const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "support",
  usage: "(Prefix)support",
  description: "Need help with Tritan?",
  execute(message) {
    let helpEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Support Server")
      .setDescription(
        "Join our [support server](https://tritan.gg/support)! We giveaway free premium, beta testing, and you'll be the first to know about any issues or updates."
      )
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(helpEmbed);
  }
};
