const { canModifyQueue } = require("../../../utils/music");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["l"],
  description: "Toggle music loop",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.loop = !queue.loop;
    
    let loopEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return queue.textChannel.send(loopEmbed);
  }
};
