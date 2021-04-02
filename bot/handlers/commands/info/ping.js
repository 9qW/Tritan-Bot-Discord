const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Ping the bot",
  usage: "(Prefix)ping",
  async execute(message, client) {
    let botMsg = await message.channel.send(`Pinging... <a:birb:763086846908956682>`);
    let ping = botMsg.createdTimestamp - message.createdTimestamp;
    let api = message.client.ws.ping;
    let colorVar;
    switch (true) {
      case ping < 150:
        colorVar = 0x7289da;
        break;
      case ping < 250:
        colorVar = 0x35fc03;
        break;
      case ping < 350:
        colorVar = 0xe3f51d;
        break;
      case ping < 400:
        colorVar = 0xf7700f;
        break;
      default:
        colorVar = 0xf7220f;
        break;
    }
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setColor(colorVar)
      .setThumbnail(message.author.displayAvatarURL())
      .setTitle(`<:Discord_Icon:767856181607137281> Ping!`)
      .setDescription(`Ponged back the ping in ${ping}ms! (API: ${api}ms)`)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    botMsg.edit(null, embed);
  }
};
