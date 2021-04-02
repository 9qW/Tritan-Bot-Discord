const fetch = require("node-fetch");
const { shuffleArray } = require("../../../utils/shuffle");
const Discord = require("discord.js");

var decode = require("unescape");

module.exports = {
  name: "trivia",
  async execute(message, args, client) {
    var difficulty = ["easy", "medium", "hard"];

    /* Pick a random difficulty */

    difficulty = difficulty[Math.floor(Math.random() * difficulty.length)];

    var b = await fetch(`https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=multiple`);

    if (!b.ok) {
      return message.channel.send(
        client.ErrorEmbed(
          `It looks like there is something wrong with the trivia API right now! Try again later`,
          message.author
        )
      );
    }

    var j = await b.json();

    var trivia = j.results[0];
    var e = new Discord.MessageEmbed();

    var wrongAnswers = trivia["incorrect_answers"];

    wrongAnswers.push(trivia["correct_answer"]);

    shuffleArray(wrongAnswers);

    var emojis = ["🇦", "🇧", "🇨", "🇩"];
    var d = ``;

    var correctEmoji = null;

    await Promise.all(
      wrongAnswers.map((answer, index) => {
        if (answer == trivia["correct_answer"]) {
          correctEmoji = emojis[index];
        }

        d += `${emojis[index]} - **${decode(answer)}**\n`;
      })
    );

    e.setTitle(`Trivia`);
    e.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
    e.setDescription(`Question: **${decode(trivia.question)}**\n\nDIFFICULTY: **${difficulty}**\n\n${d}`);
    e.setColor(message.client.config.colors.EMBED_COLOR);
    var m = await message.channel.send(e);

    await Promise.all(
      emojis.map(async (e) => {
        await m.react(e);
      })
    );

    var r = await m
      .awaitReactions((r, u) => u.id == message.author.id, {
        max: 1,
        time: 15000,
        errors: ["time"]
      })
      .catch((err) => {
        var e = new Discord.MessageEmbed();
        e.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
        e.setTitle(`Uh Oh`);
        e.setDescription(
          `You didn't answer the question fast enough! Your proably searching on google, lol bad.`
        );
        e.setColor(`#FF0000`);
        m.edit(e);
        m.reactions.removeAll();
      });

    if (!r) {
      return;
    }

    r = r.first();

    if (!r) {
      return;
    }

    if (r._emoji.name == correctEmoji) {
      var e = new Discord.MessageEmbed();
      e.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      e.setTitle(`Trivia Correct`);
      e.setDescription(
        `Question: **${unescape(
          trivia.question
        )}**\nDIFFICULTY: **${difficulty}**\n\n${d}\n\n**You did it poggers**.`
      );
      e.setColor(message.client.config.colors.EMBED_COLOR);
      m.edit(e);
      m.reactions.removeAll();
    } else {
      var e = new Discord.MessageEmbed();
      e.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      e.setTitle(`Trivia Incorrect`);
      e.setDescription(
        `Question: **${unescape(
          trivia.question
        )}**\nDIFFICULTY: **${difficulty}**\n\n${d}\n\n**The correct answer was ${correctEmoji}**`
      );
      e.setColor(`#FF0000`);
      m.edit(e);
      m.reactions.removeAll();
    }
  }
};
