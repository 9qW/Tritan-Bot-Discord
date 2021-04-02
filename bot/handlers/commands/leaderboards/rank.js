const Canvas = require("discord-canvas");
const Discord = require("discord.js");
const Levels = require("discord-xp");

module.exports = {
  name: "rank",
  description: "View your rank card",
  aliases: ["me", "level", "xp"],
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = await Levels.fetch(target.id, message.guild.id, true);

    if (!user) return message.channel.send("Seems like this user has not earned any xp so far.");

    const plusone = user.level + 1;
    const nextlevel = Levels.xpFor(plusone);
    const percent = Math.round((user.xp / nextlevel) * 100);

    let image = await new Canvas.RankCard()
      .setAvatar(target.displayAvatarURL({ format: "jpg" }))
      .setXP("current", user.xp)
      .setXP("needed", nextlevel)
      .setLevel(user.level)
      .setRank(user.position)
      .setReputation(user.xp)
      .setRankName(message.guild.name)
      .setUsername(target.tag)
      .setBadge(1, "gold")
      .setBadge(2, "diamond")
      .setBadge(3, "silver")
      .setBadge(4, "bronze")
      .setBackground("https://cdn.tritan.gg/tritan-bot/rank-card.jpg")
      .toAttachment();

    let attachment = new Discord.MessageAttachment(image.toBuffer(), "rank-card.png");
    return message.channel.send(attachment);
  }
};
