const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "serverstats",
  description: "Get some server stats!",
  usage: "(Prefix)serverstats",
  async execute(message) {
    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, fetching server info from the API.`
    );
    const guild = message.guild;
    const ServerEmbed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle("Server Stats:")
      .addField("👥  Member Count: ", "**" + guild.memberCount + "**" + " members!")
      .addField("👑  Server Owner: ", guild.owner)
      .addField("🔌  Server ID: ", guild.id)
      .addField("📅  Creation Date:", guild.createdAt)
      .addField(
        "🤖  Bot Count:",
        "**" + message.guild.members.cache.filter((member) => member.user.bot).size + "**" + " Bot(s)"
      )
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    waiting.edit(null, ServerEmbed);
  }
};
