const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");

module.exports = {
  name: "serverinfo",
  aliases: ["server"],
  usage: "(Prefix)serverinfo",
  description: "View the server's profile card!",
  async execute(message) {
    const guildInfo = await message.client.models.guild.findOne({ guildID: message.guild.id });
    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, fetching server info from the API.`
    );
    let embed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle("Server Info:")
      .addField("π Server Name:", message.guild.name, true)
      .addField("#οΈβ£ Server ID:", message.guild.id, true)
      .addField("π Premium Status:", guildInfo.is_premium, true)
      .addField("β Blacklist Status:", guildInfo.is_blacklisted, true)
      .addField("π€ Beta Status:", guildInfo.betaGuild, true)
      .addField("π Awarded Badges:", guildInfo.badges || "None", true)
      .addField("β±οΈ Server Created:", message.guild.createdAt, true)
      .addField("β­ Server Owner:", message.guild.owner, true)
      .addField("π Server Region:", message.guild.region, true)
      .addField("π Verification Level:", message.guild.verificationLevel, true)
      .addField("β­ Total Roles:", message.guild.roles.cache.size, true)
      .addField("π¨ Channel Count:", message.guild.channels.cache.size, true)
      .addField(
        "π¨ Total Bansβ¦",
        `\`${numeral(await message.guild.fetchBans().size).format("0,0")}\` banned members.`,
        true
      )
      .addField(
        "π Text Channels:",
        message.guild.channels.cache.filter((channel) => channel.type === "text").size,
        true
      )
      .addField(
        "π Voice Channels:",
        message.guild.channels.cache.filter((channel) => channel.type === "voice").size,
        true
      )
      .addField("β½ Member Count:", message.guild.memberCount, true)
      .addField("π€ Total Bots:", message.guild.members.cache.filter((m) => m.user.bot).size, true)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    waiting.edit(null, embed);
  }
};
