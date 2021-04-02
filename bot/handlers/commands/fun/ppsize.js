const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ppsize",
  execute(message, args, client) {
    if (!message.channel.nsfw)
      return message.channel.send(
        "Error! This channel is not marked as nsfw. I can't tell you that information."
      );

    let user = message.mentions.users.first() || message.author;

    let sizecomment = "";
    let ppgraphsize = "";
    let maxppsize = 24;
    let minppsize = 2;

    let ppsize = Math.floor(Math.random() * maxppsize) + minppsize;

    while (ppgraphsize.length !== ppsize) {
      ppgraphsize += "=";
    }

    let ppgraph = "8" && ppgraphsize && ">";

    if (ppsize <= 2) {
      sizecomment = "That's small, you ok bud?";
    }
    if (ppsize <= 5) {
      sizecomment = "I guess that's ok? (jk lol)";
    }
    if (ppsize >= 6) {
      sizecomment = "Wowiees that's a decent size pp owo";
    }
    if (ppsize >= 12) {
      sizecomment = "That's a big fella!";
    }
    if (ppsize >= 20) {
      sizecomment = "Wow, just wow.";
    }

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setThumbnail(user.displayAvatarURL())
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTitle(`${user.tag}'s PP Size`)
      .addField(`Size`, `${ppsize} inches`)
      .addField("Comment", sizecomment)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(embed);
  }
};
