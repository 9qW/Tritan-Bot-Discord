const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "suggest",
  aliases: ["suggestion", "sug"],
  description: "Make a server suggestion!",
  usage: "(Prefix)suggest [Suggestion]",

  async execute(message, args) {
    function getRandomString(length) {
      var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var result = "";
      for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
    }
    let suggestion = args.join(" ");
    if (!suggestion) return message.channel.send(`Please provide a suggestion!`).then((m) => m.delete(15000));
    let sChannel = message.guild.channels.cache.find((x) => x.name === "suggestions");
    if (!sChannel)
      return message.channel.send("This server doesn't have a channel with the name `suggestions`.");
    let suggestembed = new MessageEmbed()
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
      .setTitle("Submitted Suggestion")
      .setDescription(`${suggestion}`)
      .setFooter(`ID: ${getRandomString(5)} | Submitted`)
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    sChannel.send(suggestembed).then(async (msg) => {
      await msg.react("✅");
      await msg.react("❌");
    });
  }
};
