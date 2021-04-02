const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "fox",
  description: "Shows a cute fox photo!",
  usage: "(Prefix)fox",
  async execute(message, args) {
    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
    const res = await fetch("https://randomfox.ca/floof/");
    const img = (await res.json()).image;
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("🦊  What does the fox say?")
      .setImage(img)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    m.edit(null, embed);
  }
};
