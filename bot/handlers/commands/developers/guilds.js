const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "dev.guilds",
  description: "Displays all guilds within the same shard",
  usage: "(Prefix)dev.guilds",
  devOnly: true,
  async execute(message, args, client) {
    const guilds = message.client.guilds.cache.array();
    /**
     * Creates an embed with guilds starting from an index.
     * @param {number} start The index to start from.
     */

    const generateEmbed = (start) => {
      const current = guilds.slice(start, start + 10);

      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`Showing guilds ${start + 1}-${start + current.length} out of ${guilds.length}`)
        .setColor(message.client.config.colors.EMBED_COLOR);
      current.forEach((g) =>
        embed.addField(
          g.name,
          `**ID:** ${g.id}
**Owner:** ${g.owner.user.tag}
**Dashboard:** https://tritan.gg/dashboard/${g.id}`
        )
      );
      return embed;
    };

    const author = message.author;

    message.channel.send(generateEmbed(0)).then((message) => {
      if (guilds.length <= 10) return;
      message.react("➡️");
      const collector = message.createReactionCollector(
        (reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && user.id === author.id,
        { time: 60000 }
      );

      let currentIndex = 0;
      collector.on("collect", (reaction) => {
        message.reactions.removeAll().then(async () => {
          reaction.emoji.name === "⬅️" ? (currentIndex -= 10) : (currentIndex += 10);
          message.edit(generateEmbed(currentIndex));
          if (currentIndex !== 0) await message.react("⬅️");
          if (currentIndex + 10 < guilds.length) message.react("➡️");
        });
      });
    });
  }
};
