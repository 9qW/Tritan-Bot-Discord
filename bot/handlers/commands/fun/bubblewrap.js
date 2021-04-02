const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bubblewrap",
  description: "Gives you a virtual bubblewrap!",
  usage: "(Prefix)bubblewrap",
  execute(message) {
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`Bubblewrap`)
      .setDescription(
        ("||owo||".repeat(Math.ceil(Math.random() * 5 + 7)) + "\n").repeat(Math.ceil(Math.random() * 5 + 7))
      )
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  }
};
