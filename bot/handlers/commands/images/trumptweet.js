fetch = require("node-fetch");
(Discord = require("discord.js")),
  (module.exports = {
    name: "trumptweet",
    description: "API does things.",
    usage: "(Prefix)tweet {user} {message}",
    async execute(message, args) {
      const text = args.join(" ");
      if (!text) {
        return message.reply("please send some text for the tweet.");
      }
      const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
      const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${text}`));
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "trumptweet.png");
      message.channel.send(attachment);
      m.delete();
    }
  });
