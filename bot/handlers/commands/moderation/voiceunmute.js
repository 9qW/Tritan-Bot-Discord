const discord = require("discord.js");

module.exports = {
  name: "voiceunmute",
  async execute(message, args, client) {
    if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MUTE_MEMBERS"))
      return message.reply(`You Don't have Permission!`);

    const unmuteUser = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );

    if (!unmuteUser.voice.serverMute) {
      return message.channel
        .send("Member is not in a voice channel or isn't muted.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    try {
      unmuteUser.voice.setMute(false, "unmuteReason");
    } catch (err) {
      message.client.utils.sentry.captureException(err);
      console.error(err);
      message
        .reply("I was unable to voice unmmute this user, please check my permissions and try again.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    try {
      unmuteUser.user.send(`You've been **Unmuted** from **${message.guild.name}**`);
    } catch (err) {
      message.client.utils.sentry.captureException(err);
      console.error(err);
      message.reply("I was unable to dm this member, unmuting...").then((m) => m.delete({ timeout: 5000 }));
    }

    message.channel.send(
      `**${unmuteUser.user.tag}** was successfully unmuted from the server. I have also send a DM letting the person know.`
    );
  }
};
