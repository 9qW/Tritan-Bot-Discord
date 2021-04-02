const { MessageEmbed } = require("discord.js");
const superagent = require("snekfetch");

module.exports = {
  name: "tickle",
  description: "Allows you to tickle a user",
  usage: "(Prefix)tickle [user mention]",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply("mention someone to tickle!");

    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
    superagent.get("https://nekos.life/api/v2/img/tickle").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(user.username + " just got tickled by " + message.author.username)
        .setImage(response.body.url)
        .setDescription(user.toString() + " got tickled by " + message.author.toString())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.colors.EMBED_COLOR);
      m.edit(null, lewdembed);
    });
  }
};
