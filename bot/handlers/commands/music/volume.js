const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../../../utils/music");

module.exports = {
  name: "volume",
  usage: "(Prefix)volume [#]",
  description: "Change volume of currently playing music",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("You need to join a voice channel first!").catch(console.error);
    if (!args[0]) return message.reply(`🔊 The current volume is: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Please use a number to set volume.").catch(console.error);
    //if (Number(args[0]) > 100 || Number(args[0]) < 0)
    //return message.reply("Please use a number between 0 - 100.").catch(console.error);
    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let set = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setThumbnail(message.guild.iconURL())
      .setDescription(`The volume has been set to **${args[0]}%**.`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp();
    return queue.textChannel.send(set).catch(console.error);
  }
};
