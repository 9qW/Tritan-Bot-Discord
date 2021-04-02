const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "snipe",
  aliases: ["ms", "messagesnipe"],
  usage: "(prefix)snipe",
  description: "get deleted messages",
  premium: true,
  async execute(message, args) {
    const msg = message.client.snipes.get(message.channel.id);
    if (!msg) return message.channel.send("There are no deleted messages in this channel.");

    if (message.client.config.helpers.DEVELOPER_IDS.includes(msg.author_id)) {
      const embed = new MessageEmbed()
        .setDescription(`I can't publish any snipes authored by my active developers.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Last deleted message in #${msg.channel}.`)
        .setTimestamp();
      return message.channel.send(embed);
    }

    const embed = new MessageEmbed()
      .setAuthor(`${msg.author} (ID: ${msg.author_id})`, msg.author_avatar)
      .setDescription(msg.content)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Last deleted message in #${msg.channel}.`)
      .setTimestamp();
    if (msg.image) {
      embed.setImage(msg.image);
    }

    return message.channel.send(embed);
  }
};
