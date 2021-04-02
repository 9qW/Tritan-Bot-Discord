const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../../../utils/music");

module.exports = {
  name: "resume",
  description: "Resume currently playing music",
  usage: "(Prefix)resume",

  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("there is nothing playing at the moment.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      let pauseEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`⏸ The song has been unpaused.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return queue.textChannel.send(pauseEmbed).catch(console.error);
    }

    return message.reply("The queue is not paused.").catch(console.error);
  }
};
