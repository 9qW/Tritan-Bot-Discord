const { MessageEmbed } = module.require("discord.js");

module.exports = {
  name: "luckycolor",
  execute(message, client) {
    let color = "";
    while (color.length < 6) {
      color = Math.floor(Math.random() * 16777215).toString(16);
    }
    luckycolor = "#" + color;

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Lucky Color")
      .setDescription("Hex Code: " + luckycolor.toUpperCase())
      .setColor(luckycolor)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
   return message.channel.send(embed);
  }
};
