const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "catfact",
  usage: "(Prefix)catfact",
  description: "Says a random cat fact.",
  async execute(message, client) {
    const res = await fetch("https://catfact.ninja/fact");
    const fact = (await res.json()).fact;
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("🐱 Cat Fact")
      .setDescription(fact)
      .setFooter(`Requested By: ${message.member.displayName}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    return message.channel.send(embed);
  }
};
