const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "uptime",
  usage: "(Prefix)uptime",
  description: "Fetches Tritan's current uptime.",
  async execute(message) {
    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, pulling the uptime from the server.`
    );
    const d = moment.duration(message.client.uptime);
    const days = d.days() == 1 ? `${d.days()} day` : `${d.days()} days`;
    const hours = d.hours() == 1 ? `${d.hours()} hour` : `${d.hours()} hours`;
    const minutes = d.minutes() == 1 ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
    const seconds = d.seconds() == 1 ? `${d.seconds()} second` : `${d.seconds()} seconds`;
    const date = moment().subtract(d, "ms").format("dddd, MMMM Do YYYY");
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Uptime")
      .setDescription(`\`${days}\`, \`${hours}\`, \`${minutes}\`, and \`${seconds}\``)
      .addField("Date Launched", date)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    await waiting.edit(null, embed);
  }
};
