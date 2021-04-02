const { MessageEmbed } = require("discord.js");
const superagent = require("snekfetch");

module.exports = {
  name: "hug",
  description: "Hug a user",
  Usage: "(Prefix)hug [User Mention]",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply("mention someone to give a hug to.");

    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);

    superagent.get("https://nekos.life/api/v2/img/hug").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setImage(response.body.url)
        .setDescription(user.toString() + " got a hug from " + message.author.toString())
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.colors.EMBED_COLOR);
      m.edit(null, lewdembed);
    });
  }
};
