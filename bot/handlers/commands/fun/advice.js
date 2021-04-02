const request = require("superagent");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "advice",
  description: "Gives you some random advice",
  usage: "*advice",
  execute(message, args) {
    request.get("http://api.adviceslip.com/advice").end((err, res) => {
      if (!err && res.status === 200) {
        try {
          JSON.parse(res.text);
        } catch (e) {
          return message.channel.send("An api error occurred, please try again later..");
        }

        const advice = JSON.parse(res.text);

        const embed = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle(`Advice`)
          .setDescription(advice.slip.advice)
          .setColor(message.client.config.colors.EMBED_COLOR)
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(embed);
      } else {
        return message.channel.send(`The api is a little busy at the moment, please try this again later.`);
      }
    });
  }
};
