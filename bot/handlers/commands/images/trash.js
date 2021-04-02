jsfetch = require("node-fetch");
(Discord = require("discord.js")),
  (module.exports = {
    name: "trash",
    async execute(message, args) {
      const user =
        message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
      const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
      const res = await fetch(
        encodeURI(
          `https://nekobot.xyz/api/imagegen?type=trash&url=${user.displayAvatarURL({
            format: "png",
            size: 512
          })}`
        )
      );
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "tweet.png");
      message.channel.send(attachment);
      m.delete();
    }
  });
