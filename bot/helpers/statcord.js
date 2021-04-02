const chalk = require("chalk");
const Statcord = require("statcord.js");
const { STATCORD_TOKEN } = require("../config/tokens");

module.exports = (shard) => {
  const statcord = new Statcord.ShardingClient({
    key: STATCORD_TOKEN,
    manager: shard,
    postCpuStatistics: true,
    postMemStatistics: true,
    postNetworkStatistics: true,
    autopost: true
  });

  statcord.on("autopost-start", () => {
    console.log(chalk.blueBright("[STATCORD]"), `Started Autopost`);
  });

  statcord.on("post", () => {
    console.log(chalk.blueBright("[STATCORD]"), `Successfully posted stats.`);
  });
};
