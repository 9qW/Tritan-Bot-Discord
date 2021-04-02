const client = require("nekos.life");
const neko = new client();

module.exports = {
  name: "fact",
  description: "Displays a fun fact.",
  usage: "(Prefix)fact",
  execute(message) {
    async function work() {
      let owo = await neko.sfw.fact();
      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`Fun Fact`)
        .setDescription(owo.fact)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      message.channel.send(embed).catch((error) => {
        console.error(error);
      });
    }

    work();
  }
};
