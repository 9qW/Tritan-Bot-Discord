const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: "glossy",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;

    let link = `https://some-random-api.ml/canvas/glass/?avatar=${user.displayAvatarURL({
      format: "png"
    })}`;

    let attachment = new MessageAttachment(link, "glass.png");

    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR)
      .attachFiles(attachment)
      .setImage("attachment://glass.png");
    message.channel.send(embed);
  }
};
