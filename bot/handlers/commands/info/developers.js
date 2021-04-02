const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "developers",
  aliases: ["devs"],
  async execute(message) {
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot & Team Tritan Staff`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .addField("Owner", ["- Dylan_James"])
      .addField("Contributing Developers", ["- Crafterzman\n- Windows\n- Nirlep"])
      .addField(
        "Links",
        "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&scope=bot) | " +
          "[Support Server](https://discord.gg/ScUgyE2)** | " +
          "**[Website](https://tritan.gg)**"
      )
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    return message.channel.send(embed);
  }
};
