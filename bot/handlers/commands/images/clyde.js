fetch = require("node-fetch");
(Discord = require("discord.js")),
  (module.exports = {
    name: "clyde",
    premium: true,
    description: "Returns an image of clyde saying text.",
    usage: "(Prefix)clyde {test}",
    async execute(message, args) {
      const text = args.join(" ");

      if (!args) {
        return message.reply(`You need to add some text to meme-ify.`);
      }
      const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
      const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`));
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "clyde.png");
      message.channel.send(attachment);
      m.delete();
    }
  });
