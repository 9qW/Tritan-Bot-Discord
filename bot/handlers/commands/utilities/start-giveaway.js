const ms = require("ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "start-giveaway",
  aliases: ["gstart"],
  description: "Begin a reaction based giveaway.",
  execute(message, args, client) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      const noPerms = new MessageEmbed();
      noPerms.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      noPerms.setTitle("Start Giveaway");
      noPerms.setDescription(":x: You need to have the manage messages permissions to start giveaways.");
      noPerms.setColor(message.client.config.colors.EMBED_COLOR);
      noPerms.setTimestamp();
      noPerms.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(noPerms);
    }

    let giveawayChannel = message.mentions.channels.first();
    if (!giveawayChannel) {
      const invalidChannel = new MessageEmbed();
      invalidChannel.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      invalidChannel.setTitle("Start Giveaway");
      invalidChannel.setDescription(
        ":x: You have to mention a valid channel!  \n Ex. (no brackets): `*start-giveaway [Channel Tag] [Time (M/H/D)] [# Of Winners] [Title of Giveaway]`"
      );
      invalidChannel.setColor(message.client.config.colors.EMBED_COLOR);
      invalidChannel.setTimestamp();
      invalidChannel.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(invalidChannel);
    }

    let giveawayDuration = args[1];
    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
      const invalidDuration = new MessageEmbed();
      invalidDuration.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      invalidDuration.setTitle("Start Giveaway");
      invalidDuration.setDescription(
        ":x: You have to mention a valid duration!  \n Ex. (no brackets): `*start-giveaway [Channel Tag] [Time (M/H/D)] [# Of Winners] [Title of Giveaway]`"
      );
      invalidDuration.setColor(message.client.config.colors.EMBED_COLOR);
      invalidDuration.setTimestamp();
      invalidDuration.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(invalidDuration);
    }

    let giveawayNumberWinners = args[2];
    if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
      const invalidNumber = new MessageEmbed();
      invalidNumber.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      invalidNumber.setTitle("Start Giveaway");
      invalidNumber.setDescription(
        ":x: You have to mention a valid number of winners!  \n Ex. (no brackets): `*start-giveaway [Channel Tag] [Time (M/H/D)] [# Of Winners] [Title of Giveaway]`"
      );
      invalidNumber.setColor(message.client.config.colors.EMBED_COLOR);
      invalidNumber.setTimestamp();
      invalidNumber.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(invalidNumber);
    }

    let giveawayPrize = args.slice(3).join(" ");
    if (!giveawayPrize) {
      const invalidPrize = new MessageEmbed();
      invalidPrize.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      invalidPrize.setTitle("Start Giveaway");
      invalidPrize.setDescription(
        ":x: You have to mention a valid prize!  \n Ex. (no brackets): `*start-giveaway [Channel Tag] [Time (M/H/D)] [# Of Winners] [Title of Giveaway]`"
      );
      invalidPrize.setColor(message.client.config.colors.EMBED_COLOR);
      invalidPrize.setTimestamp();
      invalidPrize.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(invalidPrize);
    }

    message.client.giveawaysManager.start(giveawayChannel, {
      time: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: giveawayNumberWinners,
      hostedBy: message.author,
      messages: {
        giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
        giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
        timeRemaining: "Time remaining: **{duration}**!",
        inviteToParticipate: "React with 👋  to participate!",
        winMessage: "Congratulations, {winners}! You won **{prize}**!",
        embedFooter: "Tritan Bot",
        noWinner: "Giveaway cancelled, no valid participations.",
        hostedBy: "Created by: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days",
          pluralS: false
        }
      }
    });

    const success = new MessageEmbed();
    success.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
    success.setTitle("Start Giveaway");
    success.setDescription(`A giveaway has been started in ${giveawayChannel}!`);
    success.setColor(message.client.config.colors.EMBED_COLOR);
    success.setTimestamp();
    success.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    message.channel.send(success);
  }
};
