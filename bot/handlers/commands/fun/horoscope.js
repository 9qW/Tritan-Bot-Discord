const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "horoscope",
  premium: true,
  async execute(message, args, client) {
    const sign = args.join(" ");
    if (!sign) {
      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`Horoscope: Invalid Arguments`)
        .setThumbnail(
          `https://img.pngio.com/free-clipart-of-horoscope-astrology-zodiac-libra-scales-libra-scales-png-4000_4298.png`
        )
        .setDescription(
          "Please add the horoscope sign you would like to view at the end of this command. \n Example: `*horoscope libra`"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.colors.EMBED_COLOR);
      return message.channel.send(embed);
    }

    try {
      fetch(`http://horoscope-api.herokuapp.com/horoscope/today/${sign}`)
        .then((res) => res.json())
        .then((json) => {
          const embed = new MessageEmbed()
            .setAuthor(`${message.author.tag}'s Horoscope`, message.author.displayAvatarURL())
            .setDescription(json.horoscope)
            .setThumbnail(
              `https://img.pngio.com/free-clipart-of-horoscope-astrology-zodiac-libra-scales-libra-scales-png-4000_4298.png`
            )
            .setFooter(`Requested Horoscope for ${sign}`)
            .setTimestamp()
            .setColor(message.client.config.colors.EMBED_COLOR);
          message.channel.send(embed);
        });
    } catch (err) {
      return message.channel.send("Something went wrong. Please try again in a few seconds.", err);
    }
  }
};
