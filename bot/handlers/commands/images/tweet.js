fetch = require("node-fetch");
(Discord = require("discord.js")),
  (module.exports = {
    name: "tweet",
    description: "API does things.",
    premium: true,
    usage: "(Prefix)tweet {user} {message}",
    async execute(message, args) {
      const user = args[0];
      const text = args.slice(1).join(" ");

      if (!user) {
        return message.reply("please send a username first.");
      }

      if (!text) {
        return message.reply("please send some text second.");
      }
      const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
      const res = await fetch(
        encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`)
      );
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "tweet.png");
      message.channel.send(attachment);
      m.delete();
    }
  });
