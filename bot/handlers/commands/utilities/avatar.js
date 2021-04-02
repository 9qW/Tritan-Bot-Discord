const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  usage: "(Prefix)avatar",
  description: "View your avatar!",
  execute(message, args) {
    let user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("User Avatar")
      .addField("User:", user.username, false)
      .addField(`Avatar URL:`, [`[Click Me](${user.displayAvatarURL()})`])
      .setImage(
        user.displayAvatarURL({
          dynamic: true,
          size: 1024
        })
      )
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed).catch(console.error);
  }
};
