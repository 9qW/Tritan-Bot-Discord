const { MessageEmbed } = require("discord.js");

const YouTubeAPI = require("simple-youtube-api");

module.exports = {
  name: "search",
  usage: "(Prefix)search [keyword]",
  description: "Search and select videos to play",
  async execute(message, args) {
    const youtube = new YouTubeAPI(message.client.config.tokens.YOUTUBE_API_KEY);
    if (!args.length)
      return message.reply(`Usage: *${module.exports.name} <Video Name>`).catch(console.error);
    if (message.channel.activeCollector)
      return message.reply("a message collector is already active in this channel.");
    if (!message.member.voice.channel)
      return message.reply("you need to join a voice channel first.").catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setThumbnail(message.guild.iconURL())
      .setTitle(`**Reply with the song number you want to play**`)
      .setDescription(`Results for: ${search}`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      let resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
        return pattern.test(msg.content);
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ["time"]
      });
      const reply = response.first().content;

      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());

        for (let song of songs) {
          await message.client.commands
            .get("play")
            .execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
        }
      } else {
        const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
        message.client.commands.get("play").execute(message, [choice]);
      }

      message.channel.activeCollector = false;
      resultsMessage.delete().catch(console.error);
      response.first().delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
      message.reply("Error:" + error).catch(console.error);
    }
  }
};
