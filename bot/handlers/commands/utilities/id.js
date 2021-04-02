const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "id",
  aliases: ["member-id"],
  description: "Get the ID of a member in your guild.",
  usage: "(Prefix)id [user mention]",

  async execute(message, args) {
    var mention = message.guild.member(message.mentions.users.first());
    if (!mention) return message.channel.send("Mention a user to get their ID");
    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, fetching user ID from the API.`
    );
    const userID = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("User ID")
      .setThumbnail(mention.user.avatarURL())
      .addField(`User:`, mention.user.tag)
      .addField(`ID:`, mention.id)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.colors.EMBED_COLOR);
    waiting.edit(null, userID);
  }
};
