const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "servericon",
  aliases: ["si"],
  usage: "(Prefix)servericon",
  description: "Displays the server's icon.",
  async execute(message) {
    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, fetching server icon from the API.`
    );
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`${message.guild.name}'s Icon`)
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp();
    waiting.edit(null, embed);
  }
};
