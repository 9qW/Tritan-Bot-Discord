const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "dev.help",
  description: "Auto pulls all commands w/ exports",
  usage: "(Prefix)dev.help",
  devOnly: true,
  async execute(message, args, client) {
    let commands = message.client.commands.array();
    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });
    /**
     * Creates an embed with guilds starting from an index.
     * @param {number} start The index to start from.
     */

    const generateEmbed = (start) => {
      const current = commands.slice(start, start + 20);

      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`Showing ${start + 1}-${start + current.length} out of ${commands.length} commands.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setAuthor("Tritan Bot", "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setDescription(
          `Tritan Bot is a general purpose discord bot! Listed below are all the commands we currently offer, broken up by category.\n\n`
        )
        .setTimestamp()
        .setThumbnail(message.guild.iconURL())
        .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
      current.forEach((cmd) =>
        embed.addField(
          `**${settings.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
          `${cmd.description}`,
          true
        )
      );
      return embed;
    };

    const author = message.author;

    message.channel.send(generateEmbed(0)).then((message) => {
      if (commands.length <= 20) return;
      message.react("➡️");
      const collector = message.createReactionCollector(
        (reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && user.id === author.id,
        { time: 60000 }
      );

      let currentIndex = 0;
      collector.on("collect", (reaction) => {
        message.reactions.removeAll().then(async () => {
          reaction.emoji.name === "⬅️" ? (currentIndex -= 20) : (currentIndex += 20);
          message.edit(generateEmbed(currentIndex));
          if (currentIndex !== 0) await message.react("⬅️");
          if (currentIndex + 20 < commands.length) message.react("➡️");
        });
      });
    });
  }
};
