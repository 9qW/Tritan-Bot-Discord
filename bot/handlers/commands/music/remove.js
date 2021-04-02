const { canModifyQueue } = require("../../../utils/music");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  usage: "(Prefix)remove [#]",
  description: "Remove song from the queue",
  execute(message, args) {
    const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(`Usage: (Prefix)remove <Queue Number>`);
    const arguments = args.join("");
    const songs = arguments.split(",").map((str) => str.trim());
    let removed = [];

    if (pattern.test(arguments) && songs.every((value) => value < queue.songs.length)) {
      queue.songs = queue.songs.filter((item, index) => {
        if (songs.every((value) => value - 1 != index)) {
          return true;
        } else {
          removed.push(item);
        }
      });

      let embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`❌ removed **${removed.map((song) => song.title).join("\n")}** from the queue.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      queue.textChannel.send(embed).catch(console.error);
    } else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
      let embed2 = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`❌ removed **${queue.songs.splice(args[0] - 1, 1)[0].title}** from the queue.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return queue.textChannel.send(embed2);
    } else {
      return message.reply(`Usage: (Prefix)remove <Queue Number>`);
    }
  }
};
