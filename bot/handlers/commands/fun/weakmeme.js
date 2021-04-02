const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "weakmeme",
  usage: "(Prefix)meme",
  description: "Pulls a meme from Reddit for a quick laugh! :)",

  async execute(message, client) {
    let res = await fetch("https://meme-api.herokuapp.com/gimme");
    res = await res.json();
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setDescription(res.title)
      .setImage(res.url)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    message.channel.send(embed);
  }
};
