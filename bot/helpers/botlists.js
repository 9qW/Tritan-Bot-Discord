const { TOPGG_TOKEN, ClIENT_ID } = require("../config/tokens");

const fetch = require("node-fetch");
const AutoPoster = require("topgg-autoposter");
const chalk = require("chalk");

module.exports = (shard) => {
  // Top.gg
  if (TOPGG_TOKEN) {
    const topggStats = AutoPoster(TOPGG_TOKEN, shard);
    topggStats.on("posted", () => {
      console.log(chalk.blueBright("[TOP.GG]"), `Successfully posted stats.`);
    });
  }

  // Botrix
  setInterval(() => {
    const promises = [
      shard.fetchClientValues("guilds.cache.size"),
      shard.broadcastEval("this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)")
    ];
    return Promise.all(promises).then((results) => {
      const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      const body = { servers: totalGuilds, shards: shard.totalShards, users: totalMembers };

      fetch(`https://botrix.cc/api/v1/bot/${ClIENT_ID}`, {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
      console.log(chalk.blueBright("[BOTRIX]"), `Successfully posted stats.`);
    });
  }, 3600000);
};
