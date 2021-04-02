const { MessageEmbed } = require("discord.js");
const { post } = require("snekfetch");

module.exports = {
  name: "pastebin",
  aliases: ["pb", "bin", "codebin", "hastebin"],
  premium: true,
  async execute(message, args) {
    const waiting = await message.channel.send(`<a:birb:763086846908956682> Please wait...`);
    const text = args.join("  ");
    const { body } = await post("https://bin.tritan.gg/documents").send(text);
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Pastebin")
      .addField("Paste URL:", `https://bin.tritan.gg/${body.key}.js`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
    waiting.edit(null, embed);
  }
};
