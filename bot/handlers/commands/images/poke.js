const { MessageEmbed } = require("discord.js");
const superagent = require("snekfetch");

module.exports = {
  name: "poke",
  usage: "(Prefix)poke [user mention]",
  description: "Allows you to poke another user, no this isn't facebook.",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply("Mention someone to poke!");

    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);

    superagent.get("https://nekos.life/api/v2/img/poke").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setImage(response.body.url)
        .setDescription(user.toString() + " got poked by " + message.author.toString())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.colors.EMBED_COLOR);
      m.edit(null, lewdembed);
    });
  }
};
