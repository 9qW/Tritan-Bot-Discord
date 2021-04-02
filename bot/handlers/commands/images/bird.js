const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "bird",
  usage: "(Prefix)bird",
  description: "Finds a random bird for your viewing pleasure.",
  async execute(message) {
    const res = await fetch("http://shibe.online/api/birds");
    const img = (await res.json())[0];
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("🐦 Birb!")
      .setImage(img)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    return message.channel.send(embed);
  }
};
