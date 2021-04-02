const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "duck",
  description: "Finds a random duck for your viewing pleasure.",
  usage: "(Prefix)duck",
  async execute(message, args) {
    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
    const res = await fetch("https://random-d.uk/api/v2/random");
    const img = (await res.json()).url;
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("🦆 Quack!")
      .setImage(img)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    m.edit(null, embed);
  }
};
