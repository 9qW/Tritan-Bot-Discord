const StarboardsManager = require("tritanbot-starboards");
const chalk = require("chalk");
const { Database } = require("quickmongo");

module.exports = async (client) => {
  const db = new Database(client.config.tokens.MONGODB_URL);
  db.once("ready", async () => {
    console.log(chalk.yellowBright("[SHARD STARTUP]"), `Starboards helper attached to the client.`);
    if ((await db.get("Starboards")) === null) await db.set("Starboards", []);
  });

  class StarboardsManagerCustomDb extends StarboardsManager {
    async getAllStarboards() {
      return await db.get("Starboards");
    }

    async saveStarboard(data) {
      await db.push("Starboards", data);
      return true;
    }

    async deleteStarboard(channelID, emoji) {
      let newStarboardsArray = await db.get("Starboards");
      newStarboardsArray = newStarboardsArray.filter(
        (starboard) => !(starboard.channelID === channelID && starboard.options.emoji === emoji)
      );
      await db.set("Starboards", newStarboardsArray);
      return true;
    }

    async editStarboard(channelID, emoji, data) {
      const starboards = await db.get("Starboards");
      const newStarboardsArray = starboards.filter(
        (starboard) => !(starboard.channelID === channelID && starboard.options.emoji === emoji)
      );
      newStarboardsArray.push(data);
      await db.set("Starboards", newStarboardsArray);
      return true;
    }
  }

  const manager = new StarboardsManagerCustomDb(client, {
    storage: false
  });

  client.starboardsManager = manager;
};
