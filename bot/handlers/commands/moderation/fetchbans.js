module.exports = {
  name: "fetchbans",
  aliases: ["total-bans"],
  execute(message, args) {
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return message.channel
        .send(
          `${message.client.config.helpers.ERROR_X} I cannot run this command as I have insufficient permissions to do so. Please ensure I have the \"Ban Members\" permission.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    message.guild
      .fetchBans()
      .then((bans) => {
        message.channel.send(
          `This server has **${bans.size}** banned ${bans.size === 1 ? "user" : "users"}.`
        );
      })
      .catch((error) => {
        console.error(error);
        message.client.utils.sentry.captureException(error);
        return message.channel.send(
          `${message.client.config.helpers.ERROR_X} An error occurred:\n\```${error.message}\````
        );
      });
  }
};
