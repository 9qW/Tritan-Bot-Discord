const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shard",
  description: "Get the shard ID of your guild.",
  usage: "(Prefix)shard",
  ownerOnly: false,
  async execute(message) {
    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, pulling shard info from the server.`
    );
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`Shard Info`)
      .addField("Guild:", message.guild.name, true)
      .addField(`Guild ID:`, message.guild.id, true)
      .addField("Shard ID:", message.guild.shardID, true)
      .addField("Shard Ping:", message.client.ws.ping + "ms.")
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    waiting.edit(null, embed);
  }
};
