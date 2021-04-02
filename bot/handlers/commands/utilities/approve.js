const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "approve",
  description: "Approves an already submitted suggestion.",
  usage: "(Prefix)approve [Suggestion ID] [Reason]",
  premium: true,
  execute(message) {
    const args = message.content.slice(8).trim().split(/ +/g);
    const announcement = args.slice(0).join(" ");
    var parts = announcement.split("_", 2);
    const approveEmbed = new MessageEmbed()
      .setAuthor(`Tritan Suggestions`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setColor(`#00ff00`)
      .setTitle("Approved Suggestion")
      .setDescription(parts[0])
      .setTimestamp()
      .setFooter(
        `Approved by ${message.author.username}`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      );
    message.delete();
    message.channel.send(approveEmbed);
  }
};
