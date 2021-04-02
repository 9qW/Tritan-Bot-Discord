const { MessageEmbed } = require("discord.js");
const Levels = require("discord-xp");

module.exports = {
  name: "setxp",
  description: "Set a person's level",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      let mPermEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Missing Permissions")
        .setDescription(
          "Error, unable to set xp." +
            " <@" +
            message.author.id +
            "> does not have the correct permissions to run this command."
        )
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(mPermEmbed).catch(console.error);
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply("You need to mention a user, ID's will not work here.");

    const amount = args[1];
    try {
      Levels.setXp(target.id, message.guild.id, amount);
      let embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setDescription(`**${target.tag}**'s XP has been set to ${amount}.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(embed).catch(console.error);
    } catch (e) {
      return message.channel.send("Error, please try again. ", e);
    }
  }
};
