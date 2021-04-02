const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../../../utils/music");

module.exports = {
  name: "skipto",
  usage: "(Prefix)skipto [#]",
  description: "Skip to the selected queue number",
  premium: true,
  execute(message, args) {
    if (!args.length || isNaN(args[0]))
      return message.reply(`Usage: (Prefix)${module.exports.name} <Queue Number>`).catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (args[0] > queue.songs.length)
      return message.reply(`The queue is only ${queue.songs.length} songs long!`).catch(console.error);

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    queue.connection.dispatcher.end();
    let skiptoEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setThumbnail(message.guild.iconURL())
      .setDescription(`⏭ ${message.author} skipped ${args[0] - 1} songs`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp();
    return queue.textChannel.send(skiptoEmbed).catch(console.error);
  }
};
