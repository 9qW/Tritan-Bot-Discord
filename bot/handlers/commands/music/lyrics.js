const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  description: "Get lyrics for the currently playing song",
  usage: "(Prefix)lyrics",

  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("there is nothing playing at the moment.").catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `I'm sorry... no lyrics were found for ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `I'm sorry, no lyrics found were for ${queue.songs[0].title}.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setThumbnail(message.guild.iconURL())
      .setTitle(`Song Lyrics: ${queue.songs[0].title}`)
      .setDescription(lyrics)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
