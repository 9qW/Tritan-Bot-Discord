const ms = require("ms");
module.exports = {
  name: "end-giveaway",
  aliases: ["gend"],
  description: "Begin a reaction based giveaway.",
  execute(message, args, client) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.channel.send(
        ":x: You need to have the manage messages permissions to reroll giveaways."
      );
    }

    if (!args[0]) {
      return message.channel.send(":x: You have to specify a valid message ID!");
    }

    let giveaway =
      message.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(" ")) ||
      message.client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    if (!giveaway) {
      return message.channel.send("Unable to find a giveaway for `" + args.join(" ") + "`.");
    }

    message.client.giveawaysManager
      .edit(giveaway.messageID, {
        setEndTimestamp: Date.now()
      })
      .then(() => {
        message.channel.send(
          "Giveaway will end in less than " +
            message.client.giveawaysManager.options.updateCountdownEvery / 1000 +
            " seconds..."
        );
      })
      .catch((e) => {
        if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)) {
          message.channel.send("This giveaway is already ended!");
        } else {
          console.error(e);
          message.channel.send("An error occured...");
        }
      });
  }
};
