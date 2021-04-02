const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "quote",
  description: "Pulls an inspirational quote from the interwebs.",
  usage: "(Prefix)quote",
  async execute(message, args, client) {
    const url = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
    let response;
    try {
      response = await fetch(url).then((res) => res.json());
    } catch (e) {
      return message.channel.send("An API error occured, please try again!");
    }
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setDescription(response.quoteText + ` - ${response.quoteAuthor}`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(embed);
  }
};
