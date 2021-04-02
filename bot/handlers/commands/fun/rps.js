const { MessageEmbed } = require("discord.js");
const rps = ["scissors", "rock", "paper"];
const res = ["Scissors :v:", "Rock :fist:", "Paper :raised_hand:"];

module.exports = {
  name: "rps",
  aliases: ["rockpapersissors"],
  usage: "rps <rock | paper | scissors>",
  description: "Play a game of rock–paper–scissors against Tritan!",
  async execute(message, args) {
    let userChoice;
    if (args.length) userChoice = args[0].toLowerCase();
    if (!args) return message.reply("Please enter `rock`, `paper`, or `scissors` as an argument.");
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random() * 3);
    let result;
    if (userChoice === botChoice) result = "It's a draw!";
    else if (botChoice > userChoice || (botChoice === 0 && userChoice === 2)) result = "**Tritan** wins!";
    else result = `**${message.member.displayName}** wins!`;
    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`${message.member.displayName} vs. Tritan`)
      .addField("Your Choice", res[userChoice], true)
      .addField("Tritan's Choice", res[botChoice], true)
      .addField("Result", result, true)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    return message.channel.send(embed);
  }
};
