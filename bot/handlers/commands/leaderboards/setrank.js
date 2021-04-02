const { MessageEmbed } = require("discord.js");
const Levels = require("discord-xp");

module.exports = {
  name: "setrank",
  description: "Set a person's level",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      let mPermEmbed = new MessageEmbed()
        .setTitle("Missing Permissions")
        .setDescription(
          "Error, unable to set level." +
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
      Levels.setLevel(target.id, message.guild.id, amount);
      let embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setDescription(`**${target.tag}** has been set to rank ${amount}.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(embed).catch(console.error);
    } catch (e) {
      return message.channel.send("Error, please try again. ", e);
    }
  }
};
