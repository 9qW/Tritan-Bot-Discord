const request = require("node-superfetch");
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "chuck",
  usage: "(Prefix)chuck",
  description: "Grab a random funny Chick Norris joke1",
  async execute(message) {
    const { body } = await request.get("http://api.icndb.com/jokes/random").query({
      escape: "javascript",
      exclude: message.channel.nsfw ? "" : "[explicit]"
    });

    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`Chuck Norris Joke`)
      .setDescription(body.value.joke)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  }
};
