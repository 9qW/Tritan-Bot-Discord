const { MessageEmbed } = require("discord.js");
const superagent = require("snekfetch");

module.exports = {
  name: "slap",
  description: "Allows you to slap a user",
  usage: "(Prefix)slap [user mention]",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply("Mention someone to slap!");

    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);

    superagent.get("https://nekos.life/api/v2/img/slap").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setImage(response.body.url)
        .setDescription(user.toString() + " got slapped by " + message.author.toString())
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.colors.EMBED_COLOR);
      m.edit(lewdembed);
    });
  }
};
