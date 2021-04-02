const client = require("nekos.life");
const neko = new client();
const Discord = require("discord.js");

module.exports = {
  name: "boobs",
  cooldown: 10,
  nsfw: true,
  async execute(message, args, client) {
    async function boobs() {
      const GIF = await neko.nsfw.hentai();
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTitle(`:zzz: Here's some hentai from nekos.life lol`)
        .setTimestamp()
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setImage(GIF.url);
      message.channel.send(embed);
    }
    boobs();
  }
};
