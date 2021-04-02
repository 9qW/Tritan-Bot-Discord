const { MessageEmbed } = require("discord.js");
const check = require("../../../utils/functions/create");

module.exports = {
  name: "balance",
  aliases: ["bal"],
  async execute(message, client) {
    const user = message.mentions.users.first() || message.author;

    await check(user.id).then((wallet) => {
      let moneyEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`${user.tag}'s Balance`)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`Good job, you're racking up those coins!`)
        .addField(`💰 Today's Reward:`, "Run `*daily` to find out!")
        .addField(`🤑 Current Total:`, wallet.balance)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      message.channel.send(moneyEmbed);
    });
  }
};
