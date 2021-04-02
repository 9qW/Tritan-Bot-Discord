const Discord = require("discord.js");

module.exports = {
  name: "nsfwcommands",
  nsfw: true,
  async execute(message, args, client) {
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTitle(`NSFW Commands`)
      .setDescription(
        `Listed below are nsfw commands that are locked to nsfw channels. These images are pulled from Nekos.Life and apis like such.`
      )
      .addField(`Straight`, `boobs, pussy, hentai, blowjob, anal, threesome`)
      .addField(`Gay`, `yaoi`)
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    message.channel.send(embed);
  }
};
