const { MessageEmbed } = require("discord.js");
const createBar = require("string-progressbar");

module.exports = {
  name: "playing",
  aliases: ["nowplaying", "np"],
  description: "Shows the currently playing song",
  usage: "(Prefix)playing",

  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("there is nothing playing at the moment.").catch(console.error);
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;
    let nowPlaying = new MessageEmbed()
      .setTitle("Playing")
      .setDescription(`[${song.title}](${song.url})`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    if (song.duration > 0) {
      nowPlaying
        .addField(
          "\u200b",
          new Date(seek * 1000).toISOString().substr(11, 8) +
            "[" +
            createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
            "]" +
            (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
          false
        )
        .addField("Time Remaining: ", new Date(left * 1000).toISOString().substr(11, 8));
    }

    return message.channel.send(nowPlaying);
  }
};
