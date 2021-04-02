const { MessageEmbed } = require("discord.js");
const superagent = require("snekfetch");

module.exports = {
  name: "cat",
  description: "Sends a random image of a cat",
  async execute(message) {
    const m = await message.channel.send(
      `${message.client.config.helpers.CHECK_MARK} Please wait, fetching from the API.`
    );
    superagent.get("https://nekos.life/api/v2/img/meow").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Kitty Cat!")
        .setDescription("Here's a cat (:")
        .setImage(response.body.url)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.colors.EMBED_COLOR);
      m.edit(null, lewdembed);
    });
  }
};
