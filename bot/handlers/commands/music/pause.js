const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../../../utils/music");

module.exports = {
  name: "pause",
  usage: "(Prefix)pause",
  description: "Pause the currently playing music",

  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("there is nothing playing at the moment.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      let pauseEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`⏸ ${message.author} has paused the music.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return queue.textChannel.send(pauseEmbed).catch(console.error);
    }
  }
};
