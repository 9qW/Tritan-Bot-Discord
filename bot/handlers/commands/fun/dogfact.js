const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "dogfact",
  usage: "(Prefix)dogfact",
  description: "Shows a random dog fact.",
  async execute(message, client) {
    const res = await fetch("https://dog-api.kinduff.com/api/facts");
    const fact = (await res.json()).facts[0];
    
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("🐶  Dog Fact")
      .setDescription(fact)
      .setFooter(
        `Requested by: ${message.member.displayName}`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    return message.channel.send(embed);
  }
};
