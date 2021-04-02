const { MessageEmbed } = require("discord.js");
const { play } = require("../../../utils/play");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;

module.exports = {
  name: "playlist",
  usage: "(Prefix)playlist [keyword]",
  description: "Play a playlist from youtube",
  async execute(message, args) {
    const youtube = new YouTubeAPI(message.client.config.tokens.YOUTUBE_API_KEY);
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`you must be in the same channel as ${message.client.user}`).catch(console.error);

    if (!args.length)
      return message
        .reply(`Usage: (Prefix)playlist <YouTube Playlist URL | Playlist Name>`)
        .catch(console.error);
    if (!channel) return message.reply("you need to join a voice channel first.").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Unable to connect to voice channel, missing permissions");
    if (!permissions.has("SPEAK"))
      return message.reply("Unable to speak in this voice channel, missing permissions");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, {
          part: "snippet"
        });
        videos = await playlist.getVideos(message.client.config.helpers.MAX_PLAYLIST_SIZE || 10, {
          part: "snippet"
        });
      } catch (error) {
        console.error(error);
        return message.reply("playlist not found :( ", error.message).catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes("/sets/")) {
        message.channel.send("⌛ fetching the playlist...");
        playlist = await scdl.getSetInfo(args[0], message.client.config.tokens.SOUNDCLOUD_CLIENT_ID);
        videos = playlist.tracks.map((track) => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }));
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, {
          part: "snippet"
        });
        playlist = results[0];
        videos = await playlist.getVideos(message.client.config.helpers.MAX_PLAYLIST_SIZE || 10, {
          part: "snippet"
        });
      } catch (error) {
        console.error(error);
        return message.reply("playlist not found :(").catch(console.error);
      }
    }

    const newSongs = videos
      .filter((video) => video.title != "Private video")
      .map((video) => {
        return (song = {
          title: video.title,
          url: video.url,
          duration: video.durationSeconds
        });
      });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

    let playlistEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setThumbnail(message.guild.iconURL())
      .setTitle(`${playlist.title}`)
      .setDescription(newSongs.map((song, index) => `${index + 1}. ${song.title}`))
      .setURL(playlist.url)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";

    message.channel.send(playlistEmbed);

    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct);

      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`Could not join the channel: ${error.message}`).catch(console.error);
      }
    }
  }
};
