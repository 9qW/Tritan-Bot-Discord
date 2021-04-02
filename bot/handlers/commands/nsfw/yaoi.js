const superagent = require("snekfetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "yaoi",
  cooldown: 10,
  nsfw: true,
  async execute(message, args) {
    superagent.get("https://purrbot.site/api/img/nsfw/yaoi/gif").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(":zzz: Here's some yaoi provided by purrbot.site")
        .setImage(response.body.link)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.colors.EMBED_COLOR);
      message.channel.send(lewdembed);
    });
  }
};
