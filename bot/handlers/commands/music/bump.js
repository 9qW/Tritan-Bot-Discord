require("array.prototype.move");
const { canModifyQueue } = require("../../../utils/music");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bump",
  premium: true,
  description: "Move songs to the top of the queue",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(`Usage: (Prefix)move <Queue Number>`);
    if (isNaN(args[0])) return message.reply(`Usage: (Prefix)move <Queue Number>`);

    let songMoved = queue.songs[args[0] - 1];

    queue.songs.move(args[0] - 1, 1);

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setThumbnail(message.guild.iconURL())
      .setDescription(`🚚 **${songMoved.title}** was moved to the top of the queue.`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return queue.textChannel.send(embed);
  }
};
