module.exports = async (client) => {
  setInterval(async () => {
    const promises = [
      client.shard.fetchClientValues("guilds.cache.size"),
      client.shard.broadcastEval("this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)")
    ];
    return Promise.all(promises).then((results) => {
      const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      client.user.setActivity(`*help | tritan.gg | ${client.shard.count} shards, ${totalGuilds} servers.`, {
        type: "WATCHING"
      });
    });
  }, 300000);
};
