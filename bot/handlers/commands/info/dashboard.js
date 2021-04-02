const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dashboard",
  description: "Invite the bot to another server :)",
  usage: "(Prefix)invite",
  execute(message) {
    let helpEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .addField(`Dashboard:`, [
        `[Click Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&scope=bot)`
      ])
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(helpEmbed);
  }
};
