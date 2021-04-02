const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../../../utils/music");

module.exports = {
  name: "shuffle",
  usage: "(Prefix)shuffle",
  description: "Shuffle the music queue.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setThumbnail(message.guild.iconURL())
      .setDescription(`🔀 The queue has shuffled.`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return queue.textChannel.send(embed).catch(console.error);
  }
};
