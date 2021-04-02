const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("./music");
const ytdl = require("tritanbot-ytdl");
const scdl = require("soundcloud-downloader").default;

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
      queue.channel.leave();
      let queueEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setThumbnail(message.guild.iconURL())
        .setDescription("The music queue has ended.")
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp();
      return queue.textChannel.send(queueEmbed).catch(console.error);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdl(song.url, {
          filter: "audioonly",
          quality: "highestaudio",
          highWaterMark: 1 << 25,
          maxReconnects: 10
        });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(
            song.url,
            scdl.FORMATS.OPUS,
            message.client.config.tokens.SOUNDCLOUD_CLIENT_ID
              ? message.client.config.tokens.SOUNDCLOUD_CLIENT_ID
              : undefined
          );
        } catch (error) {
          stream = await scdl.downloadFormat(
            song.url,
            scdl.FORMATS.MP3,
            SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined
          );
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, {
        type: streamType
      })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(
        `<a:birb:763086846908956682> Please wait for the reactions to finish populating.`
      );
      await playingMessage.react("ℹ️");
      await playingMessage.react("⏭️");
      await playingMessage.react("⏸️");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("🛑");

      let embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("🎵 Now Playing")
        .setThumbnail(message.guild.iconURL()) // testing
        .setThumbnail(message.guild.iconURL())
        .setDescription(`[${song.title}](${song.url})`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      playingMessage.edit(null, embed);
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "ℹ️":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          const createBar = require("string-progressbar");
          const song = queue.songs[0];
          const seek =
            (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
          const left = song.duration - seek;
          let nowPlaying = new MessageEmbed()
            .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
            .setTitle("Currently Playing:")
            .setDescription(`${song.title}\n${song.url}`)
            .addField(
              "\u200b",
              new Date(seek * 1000).toISOString().substr(11, 8) +
                "[" +
                createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                "]" +
                (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
              false
            )
            .addField("Time Remaining: ", new Date(left * 1000).toISOString().substr(11, 8))
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
          queue.textChannel
            .send(nowPlaying)
            .then((msg) => {
              msg.delete({
                timeout: 10000
              });
            })
            .catch(console.error);
          break;

        case "⏭️":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          let skipEmbed = new MessageEmbed()
            .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
            .setDescription(`${user} ⏭️ skipped to the next song.`)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setTimestamp()
            .setThumbnail(message.guild.iconURL());
          queue.textChannel
            .send(skipEmbed)
            .then((msg) => {
              msg.delete({
                timeout: 10000
              });
            })
            .catch(console.error);
          collector.stop();
          break;

        case "⏸️":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            let pauseEmbed = new MessageEmbed()
              .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
              .setDescription(`${user} ⏸️ has paused the music.`)
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setTimestamp()
              .setThumbnail(message.guild.iconURL());
            queue.textChannel
              .send(pauseEmbed)
              .then((msg) => {
                msg.delete({
                  timeout: 10000
                });
              })
              .catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            let playEmbed = new MessageEmbed()
              .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
              .setDescription(`${user} ⏸️ has unpaused the music.`)
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setTimestamp()
              .setThumbnail(message.guild.iconURL());
            queue.textChannel
              .send(playEmbed)
              .then((msg) => {
                msg.delete({
                  timeout: 10000
                });
              })
              .catch(console.error);
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            let unmuteEmbed = new MessageEmbed()
              .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
              .setDescription(`${user} 🔊 has unmuted the music!`)
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setThumbnail(message.guild.iconURL())
              .setTimestamp();
            queue.textChannel
              .send(unmuteEmbed)
              .then((msg) => {
                msg.delete({
                  timeout: 10000
                });
              })
              .catch(console.error);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            let muteEmbed = new MessageEmbed()
              .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
              .setDescription(`${user} 🔇 has muted the music!`)
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setThumbnail(message.guild.iconURL())
              .setTimestamp();
            queue.textChannel
              .send(muteEmbed)
              .then((msg) => {
                msg.delete({
                  timeout: 10000
                });
              })
              .catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          let volumeDown = new MessageEmbed()
            .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
            .setDescription(`${user} 🔉 has decreased the volume. The volume is now ${queue.volume}%`)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setTimestamp();
          queue.textChannel
            .send(volumeDown)
            .then((msg) => {
              msg.delete({
                timeout: 10000
              });
            })
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel;
          let volumeUp = new MessageEmbed()
            .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
            .setDescription(`${user} 🔊 has increased the volume. The volume is now ${queue.volume}%`)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setTimestamp();
          queue.textChannel
            .send(volumeUp)
            .then((msg) => {
              msg.delete({
                timeout: 10000
              });
            })
            .catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          let loopEmbed = new MessageEmbed()
            .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
            .setTitle(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setTimestamp();
          queue.textChannel
            .send(loopEmbed)
            .then((msg) => {
              msg.delete({
                timeout: 10000
              });
            })
            .catch(console.error);
          break;

        case "🛑":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          let stopEmbed = new MessageEmbed()
            .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
            .setDescription(`${user} 🛑 stopped the music!`)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setTimestamp();
          queue.textChannel.send(stopEmbed).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (message.client.config.helpers.PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage
          .delete({
            timeout: 3000
          })
          .catch(console.error);
      }
    });
  }
};
