const { MessageEmbed } = require("discord.js");
const localcache = require("quick.db");

module.exports = {
  name: "afk",
  description: "Puts a user into an AFK mode, the bot sends the reason when the member is pinged.",
  usage: "(Prefix)afk [reason]",

  async execute(message, args) {
    const status = new localcache.table("AFKs");
    let afk = await status.fetch(message.author.id);
    const embed = new MessageEmbed()
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());

    if (!afk) {
      embed.setDescription(`**${message.author.tag}** is now in AFK mode.`);
      embed.addField(`Reason:`, `${args.join(" ") ? args.join(" ") : "No reason given."}`, false);
      status.set(message.author.id, args.join(" ") || `No reason given.`);
    } else {
      embed.setDescription("You are no longer in AFK mode.");
      status.delete(message.author.id);
    }

    message.channel.send(embed);
  }
};
