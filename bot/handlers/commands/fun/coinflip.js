const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "coinflip",
  description: "Flip a coin, and it will land on either 'heads' or 'tails'",
  usage: "(Prefix)coinflip",
  execute(message, args, client) {
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Coin Flip")
      .setDescription(
        Math.floor(Math.random() * 2) === 0 ? "The result is: ||Heads||" : "The result is: ||Tails||"
      )
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed).catch(console.error);
  }
};
