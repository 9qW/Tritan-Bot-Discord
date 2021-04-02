const { MessageEmbed } = require("discord.js");
const Levels = require("discord-xp");

module.exports = {
  name: "top",
  aliases: ["leaderboard"],
  description: "View a guild's leaderboard :)",
  async execute(message, args) {
    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");
    const leaderboard = await Levels.computeLeaderboard(message.client, rawLeaderboard, true);
    const lb = leaderboard.map(
      (e) =>
        `\`${e.position}.\` **${e.username}#${e.discriminator}** • \`Rank:\` ${
          e.level
        } • \`XP:\` ${e.xp.toLocaleString()}`
    );

    let embed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle(`🏅 Leaderboard`)
      .setDescription(`${lb.join("\n")}`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setURL(`https://tritan.gg/public/${message.guild.id}/ranks`)
      .setTimestamp()
      .setFooter(`Leveling System by Tritan Bot`, message.guild.iconURL());
    return message.channel.send(embed).catch(console.error);
  }
};
