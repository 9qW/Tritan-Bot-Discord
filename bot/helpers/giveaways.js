const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
const { Database } = require("quickmongo");
const { GiveawaysManager } = require("discord-giveaways");

module.exports = (client) => {
  const smoldb = new Database(client.config.tokens.MONGODB_URL);

  smoldb.once("ready", async () => {
    console.log(chalk.yellowBright("[SHARD STARTUP]"), `Giveaways helper attached to the client.`);
    if ((await smoldb.get("Giveaways")) === null) await smoldb.set("Giveaways", []);
  });

  class GiveawayManagerWithOwnDatabase extends GiveawaysManager {
    async getAllGiveaways() {
      return await smoldb.get("Giveaways");
    }

    async saveGiveaway(messageID, giveawayData) {
      await smoldb.push("Giveaways", giveawayData);
      return true;
    }

    async editGiveaway(messageID, giveawayData) {
      const giveaways = await smoldb.get("Giveaways");
      const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
      newGiveawaysArray.push(giveawayData);
      await smoldb.set("Giveaways", newGiveawaysArray);
      return true;
    }

    async deleteGiveaway(messageID) {
      const data = await smoldb.get("Giveaways");
      const newGiveawaysArray = data.filter((giveaway) => giveaway.messageID !== messageID);
      await smoldb.set("Giveaways", newGiveawaysArray);
      return true;
    }
  }

  const manager = new GiveawayManagerWithOwnDatabase(client, {
    storage: false,
    updateCountdownEvery: 10000,
    default: {
      botsCanWin: false,
      embedColor: client.config.colors.EMBED_COLOR,
      embedColorEnd: client.config.colors.EMBED_COLOR,
      reaction: "👋",
      hasGuildMembersIntent: true
    }
  });

  manager.on("giveawayEnded", (giveaway, winners) => {
    winners.forEach((member) => {
      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`<:pin:785224364785139722> Congratulations!!!`)
        .setDescription(
          `<a:gif:785224385811185744> Congratulations ${member.user.username}, you won **${giveaway.prize}**! Please reach out to the server that had initiated this giveaway to claim your prize.`
        )
        .addField("Link", `[Giveaway](${giveaway.messageURL})`)
        .setTimestamp()
        .setColor(client.config.colors.EMBED_COLOR);
      member.send(embed);
    });
  });

  client.giveawaysManager = manager;
};
