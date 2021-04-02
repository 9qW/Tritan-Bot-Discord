const { MessageEmbed } = require("discord.js");
const alexa = require("alexa-bot-api");
const ai = new alexa();

module.exports = {
  name: "ai",
  description: "Speak to an ai",
  usage: "*ai message",
  async execute(message, args, client) {
    const stuff = args.join(" ");

    if (!stuff) {
      return message.channel.send("You are missing an argument, please supply a query for this command.");
    }

    ai.getReply(stuff).then((reply) => {
      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`🤖 AI`)
        .addField("Query", stuff, true)
        .addField("Response", reply, true)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(embed);
    });
  }
};
