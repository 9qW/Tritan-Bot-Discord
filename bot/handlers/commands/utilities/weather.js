const weather = require("weather-js");
const Discord = require("discord.js");

module.exports = {
  name: "weather",
  aliases: ["climate"],
  usage: "weather (location)",
  description: "Checks a weather forecast",

  async execute(message, args) {
    let place = args.join(" ");
    if (!place) return message.channel.send("Please specify a location");
    weather.find({ search: place, degreeType: "F" }, function (error, result) {
      if (result === undefined || result.length === 0) return message.channel.send("**Invalid** location");

      var current = result[0].current;
      var location = result[0].location;

      const weatherinfo = new Discord.MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setThumbnail("http://icons.iconarchive.com/icons/papirus-team/papirus-apps/512/weather-icon.png")
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTitle(`${current.observationpoint} - **${current.skytext}**`)
        .addField("Timezone", `UTC${location.timezone}`, true)
        .addField("Temperature", `${current.temperature}°`, true)
        .addField("Feels Like", `${current.feelslike}°`, true)
        .addField("Wind", current.winddisplay, true)
        .addField("Humidity", `${current.humidity}%`, true)
        .addField("Degree Type", "F", true)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

      message.channel.send(weatherinfo);
    });
  }
};
