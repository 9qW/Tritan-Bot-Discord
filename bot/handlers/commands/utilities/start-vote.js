const Discord = require("discord.js");
const agree = "✅";
const disagree = "❎";

module.exports = {
  name: "start-vote",
  description: "Start a vote in your server",
  async execute(message, args) {
    if (!args || args[0] === "help") return message.reply("Usage: start-vote <question>");

    let question = message.content.split(" ").splice(1).join(" ");

    if (question.length < 1) {
      let msg = await message.channel.send(`Vote now! (Vote time: 2min)`);
      await msg.react(agree);
      await msg.react(disagree);

      const reactions = await msg.awaitReactions(
        (reaction) => reaction.emoji.name === agree || reaction.emoji.name === disagree,
        { time: 120000 }
      );

      msg.delete();

      var NO_Count = reactions.get(disagree);
      var YES_Count = reactions.get(agree);

      if (YES_Count == undefined) {
        var YES_Count = 1;
      } else {
        var YES_Count = reactions.get(agree);
      }

      var doneowo = new Discord.MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .addField(
          "Voting Finished:",
          "----------------------------------------\n" +
            "Total votes (Yes): " +
            `${YES_Count - 1}\n` +
            "Total votes (NO): " +
            `${NO_Count - 1}\n` +
            "----------------------------------------",
          true
        )
        .setTimestamp()
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());

      await message.channel.send(doneowo);
    } else if (question.length > 1) {
      let msg = await message.channel.send(`**Poll:** ${question} \nVote now! (Vote time: 2min)`);
      await msg.react(agree);
      await msg.react(disagree);

      const reactions = await msg.awaitReactions(
        (reaction) => reaction.emoji.name === agree || reaction.emoji.name === disagree,
        { time: 120000 }
      );

      msg.delete();

      var NO_Count = reactions.get(disagree);
      var YES_Count = reactions.get(agree);

      if (YES_Count == undefined) {
        var YES_Count = 1;
      } else {
        var YES_Count = reactions.get(agree);
      }

      var doneowo2 = new Discord.MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .addField(
          "Voting Finished:",
          "----------------------------------------\n" +
            "Question: " +
            question +
            "\n" +
            "Total votes (Yes): " +
            `${YES_Count - 1}\n` +
            "Total votes (NO): " +
            `${NO_Count - 1}\n` +
            "----------------------------------------",
          true
        )
        .setTimestamp()
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
        .setColor(message.client.config.colors.EMBED_COLOR);

      await message.channel.send(doneowo2);
    }
  }
};
