const { play } = require("../../../utils/play");
const { MessageEmbed } = require("discord.js");
const ytdl = require("tritanbot-ytdl");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;

module.exports = {
  name: "play",
  usage: "(Prefix)play [song title/url]",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays audio from YouTube or Soundcloud",
  async execute(message, args) {
    const youtube = new YouTubeAPI(message.client.config.tokens.YOUTUBE_API_KEY);
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply("you need to join a voice channel first!").catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message
        .reply(`you need to be in the same channel as ${message.client.user}.`)
        .catch(console.error);

    if (!args.length)
      return message
        .reply(`Usage: (Prefix)play <YouTube URL | Video Name | Soundcloud URL>`)
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Unable to connect to a voice channel, missing permissions.");
    if (!permissions.has("SPEAK"))
      return message.reply("I cannot speak in this voice channel, missing permissions.");

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            return message.client.commands.get("play").execute(message, [res.headers.location]);
          } else {
            return message.reply("No content could be found at that url.").catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
      return message.reply("Following url redirection...").catch(console.error);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        return message
          .reply(
            "Oops! There was an error fetching that track, please try your request again.\n" + error.message
          )
          .catch(console.error);
      }
    } else if (scRegex.test(url)) {
      if (!message.client.config.tokens.SOUNDCLOUD_CLIENT_ID)
        return message
          .reply("Missing Soundcloud Client ID in developer music configuration.")
          .catch(console.error);
      try {
        const trackInfo = await scdl.getInfo(url, message.client.config.tokens.SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: trackInfo.duration
        };
      } catch (error) {
        console.error(error);
        return message
          .reply(
            "Oops! There was an error fetching that track, please try your request again.\n" + error.message
          )
          .catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message
          .reply(`Uh-oh! There was an API glitch, please try your request again.\n${error.message}`)
          .catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      let addEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Added to Queue")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`✅ **${song.title}** has been added to the queue.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return serverQueue.textChannel.send(addEmbed).catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
    }
  }
};
