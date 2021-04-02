const { MessageEmbed } = require("discord.js");
const covid = require("novelcovid");
const moment = require("moment");

module.exports = {
  name: "covid19",
  description: "Sends covid statistics for a specific country",
  usage: "(Prefix)covid19 USA",
  async execute(message, args, client) {
    var country = args.join(" ");
    if (!country)
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp()
          .setTitle("Missing Arguments")
          .setDescription("You must provide the country to check, E.G. `Belgium`.")
          .setColor(message.client.config.colors.EMBED_COLOR)
      );

    const covidStats = await covid.countries({ country: country });
    var date = new moment(covidStats.updated).format("dddd, MMMM Do, YYYY h:mm:ss A");
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTitle(`COVID19 Stats - ${country}`)
        .addFields(
          { name: `Cases`, value: covidStats.cases.toLocaleString(), inline: true },
          { name: `Cases Today`, value: covidStats.todayCases.toLocaleString(), inline: true },
          { name: `Deaths`, value: covidStats.deaths.toLocaleString(), inline: true },
          { name: `Deaths Today`, value: covidStats.todayDeaths.toLocaleString(), inline: true },
          { name: `Recovered`, value: covidStats.recovered.toLocaleString(), inline: true },
          { name: `Recovered Today`, value: covidStats.todayRecovered.toLocaleString(), inline: true },
          { name: `Infected Right Now`, value: covidStats.active.toLocaleString(), inline: true },
          { name: `Critical Condition`, value: covidStats.critical.toLocaleString(), inline: true },
          { name: `Tested`, value: covidStats.tests.toLocaleString(), inline: true },
          { name: "Updated", value: date, inline: true }
        )
    );
  }
};
