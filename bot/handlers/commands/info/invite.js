const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite the bot to another server :)",
  usage: "(Prefix)invite",
  execute(message) {
    let helpEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .addField(`Invite Link:`, [
        `[Click Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fapi%2Fcallback&scope=bot%20applications.commands)`
      ])
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(helpEmbed).catch(console.error);
  }
};
