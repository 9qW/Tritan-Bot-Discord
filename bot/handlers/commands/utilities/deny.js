const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "deny",
  description: "Denies an already submitted suggestion.",
  usage: "(Prefix)deny [Suggestion ID]: [Reason]",
  premium: true,
  execute(message) {
    const args = message.content.slice(5).trim().split(/ +/g);
    const announcement = args.slice(0).join(" ");
    var parts = announcement.split("_", 2);
    const denyEmbed = new MessageEmbed()
      .setAuthor(`Tritan Suggestions`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setColor(`#ff0000`)
      .setTitle("Denied Suggestion")
      .setDescription(parts[0])
      .setTimestamp()
      .setFooter(
        `Denied by ${message.author.username}`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      );
    message.delete();
    message.channel.send(denyEmbed);
  }
};
