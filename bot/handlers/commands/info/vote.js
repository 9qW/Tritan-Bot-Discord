const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "vote",
  description: "Support the developement of Tritan Bot!",
  usage: "(Prefix)vote",

  execute(message) {
    const voteemb = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Vote for Tritan!")
      .addField("Top.gg", "[Vote!](https://top.gg/bot/732783297872003114/vote)", false)
      .addField("Botrix", "[Vote!](https://botrix.cc/vote/732783297872003114)", false)
      .addField("Discord Labs", "[Vote!](https://bots.discordlabs.org/bot/732783297872003114/vote)", false)
      .addField("Topcord", "[Vote!](https://topcord.xyz/bot/732783297872003114/)", false)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.colors.EMBED_COLOR);
    return message.channel.send(voteemb);
  }
};
