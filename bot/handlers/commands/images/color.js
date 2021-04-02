const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: "color",
  async execute(message, args) {
    const color = args[0];
    if (!color) {
      return message.channel.send(
        "Please send a hex code without the hashtag. \n **Example:** `*color ff0000`"
      );
    }

    let link = `https://some-random-api.ml/canvas/colorviewer/?hex=${color}`;

    let attachment = new MessageAttachment(link, "color.png");

    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`Hex Code: #${color}`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR)
      .attachFiles(attachment)
      .setImage("attachment://color.png");
    message.channel.send(embed);
  }
};
