fetch = require("node-fetch");
(Discord = require("discord.js")),
  (module.exports = {
    name: "ph",
    premium: true,
    description: "Returns an image of clyde saying text.",
    usage: "(Prefix)clyde {test}",
    async execute(message, args) {
      const text = args.join(" ");
      const user = message.author;

      if (!text) {
        return message.reply("you need to send some text as an argument.");
      }

      const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
      const res = await fetch(
        encodeURI(
          `https://nekobot.xyz/api/imagegen?type=phcomment&username=${
            user.username
          }&image=${user.displayAvatarURL({ format: "png", size: 512 })}&text=${text}`
        )
      );
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "phcomment.png");
      message.channel.send(attachment);
      m.delete();
    }
  });
