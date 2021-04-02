const { MessageEmbed } = require("discord.js");
const superagent = require("snekfetch");

module.exports = {
  name: "cuddle",
  description: "Sends a cute gif when mentioning a user to cuddle.",
  usage: "(Prefix)cuddle [user mention]",
  async execute(message, args) {
    if (message.guild === null) return;
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply("you need to mention someone to cuddle.");
    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);
    superagent.get("https://nekos.life/api/v2/img/cuddle").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setImage(response.body.url)
        .setDescription(user.toString() + " got a cuddle from " + message.author.toString())
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.colors.EMBED_COLOR);
      m.edit(null, lewdembed);
    });
  }
};
