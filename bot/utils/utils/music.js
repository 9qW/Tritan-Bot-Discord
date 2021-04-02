module.exports = {
  canModifyQueue(member) {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID !== botChannel) {
      member.send("This is embarassing! Please join a voice channel and try again.").catch(console.error);
      return;
    }
    return true;
  }
};
