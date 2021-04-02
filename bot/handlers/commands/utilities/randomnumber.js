const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "randomnumber",
  description: "Get a random number from 1 to 10.",
  usage: "(Prefix)RandomNumber",
  execute(message, args) {
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Random Number")
      .setDescription(`Your random number is: ${Math.floor(Math.random() * 10) + 1}`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(embed);
  }
};
