fetch = require("node-fetch");
(Discord = require("discord.js")),
  (module.exports = {
    name: "jealous",
    description: "API does things.",
    usage: "(Prefix)jealous {user ID 1} {user ID 2}",
    async execute(message, args) {
      const users = [
        (await message.mentions.users.first()) || message.client.users.cache.get(args[0]) || message.author,
        (await message.mentions.users.first()) || message.client.users.cache.get(args[1]) || message.author
      ];

      const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
      const res = await fetch(
        encodeURI(
          `https://nekobot.xyz/api/imagegen?type=ship&user1=${users[0].displayAvatarURL({
            format: "png",
            size: 512
          })}&user2=${users[1].displayAvatarURL({ format: "png", size: 512 })}`
        )
      );
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "tweet.png");
      message.channel.send(attachment);
      m.delete();
    }
  });
