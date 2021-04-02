const discord = require("discord.js");

module.exports = {
  name: "voicemute",
  async execute(message, args, client) {
    if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MUTE_MEMBERS"))
      return message.reply(`You Don't have Permission!`);

    const muteUser = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );

    const muteReason = args.join(" ").slice(23);

    if (muteUser.voice.serverMute) {
      return message.channel
        .send("Member is not in a voice channel or is already muted.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    try {
      muteUser.voice.setMute(true, "muteReason");
    } catch (err) {
      message.client.utils.sentry.captureException(err);
      console.error(err);
      message
        .reply("I was unable to voice mute this user, please check my permissions and try again.\n" + err)
        .then((m) => m.delete({ timeout: 5000 }));
    }

    try {
      muteUser.user.send(`You've been **Muted** from **${message.guild.name}**, Reason: **${muteReason}**`);
    } catch (err) {
      message.client.utils.sentry.captureException(err);
      console.err(err);
      message.reply("Unable to dm this member... muting.").then((m) => m.delete({ timeout: 5000 }));
    }

    message.channel.send(
      `**${muteUser.user.tag}** was successfully voice muted in the server. Reason: **${muteReason}**. `
    );
  }
};
