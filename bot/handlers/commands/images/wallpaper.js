const { MessageEmbed } = require("discord.js");
const superagent = require("snekfetch");

module.exports = {
  name: "wallpaper",
  description: "Sends the user a wallpaper image.",
  nsfw: true,
  async execute(message) {
    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
    superagent.get("https://nekos.life/api/v2/img/wallpaper").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Here's a wallpaper!")
        .setImage(response.body.url)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.colors.EMBED_COLOR);
      m.edit(null, lewdembed);
    });
  }
};
