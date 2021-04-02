const { MessageEmbed } = require("discord.js");
const https = require("https");
const url = "https://www.reddit.com/r/meme/hot/.json?limit=100";

module.exports = {
  name: "meme",
  description: "sends meme",
  usage: "(Prefix)meme",
  execute(message, args, client) {
    https.get(url, (result) => {
      var body = "";
      result.on("data", (chunk) => {
        body += chunk;
      });

      result
        .on("end", () => {
          var response = JSON.parse(body);
          var index = response.data.children[Math.floor(Math.random() * 99) + 1].data;

          if (index.post_hint !== "image") {
            var text = index.selftext;
            const textembed = new MessageEmbed()
              .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
              .setTitle(subRedditName)
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setDescription(`[${title}](${link})\n\n${text}`)
              .setURL(`https://reddit.com/${subRedditName}`)
              .setTimestamp();

            message.channel.send(textembed);
          }

          var image = index.preview.images[0].source.url.replace("&amp;", "&");
          var title = index.title;
          var link = "https://reddit.com" + index.permalink;
          var subRedditName = index.subreddit_name_prefixed;

          if (index.post_hint !== "image") {
            const textembed = new MessageEmbed()
              .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
              .setTitle(subRedditName)
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setDescription(`[${title}](${link})\n\n${text}`)
              .setURL(`https://reddit.com/${subRedditName}`)
              .setTimestamp();

            message.channel.send(textembed);
          }
          const imageembed = new MessageEmbed()
            .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
            .setTitle(subRedditName)
            .setImage(image)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setDescription(`[${title}](${link})`)
            .setURL(`https://reddit.com/${subRedditName}`)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
          message.channel.send(imageembed);
        })
        .on("error", function (e) {
          console.log("Got an error: ", e);
        });
    });
  }
};
