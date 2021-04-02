const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "starchannel",
  description: "Set or unset the starboard channel",
  usage: "(Prefix)starchannel {number of stars}",
  async execute(message, args) {
    if (message.client.starboardsManager.starboards.find((s) => s.guildID === message.guild.id)) {
      try {
        message.client.starboardsManager.delete(message.channel.id, "⭐");
        let embed = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle(`${message.client.config.helpers.CHECK_MARK} Success!`)
          .setDescription(
            `The starboard channel has been reset as there is already a channel stored, please run this command again in the channel you wish to set as the starboard.`
          )
          .setColor(message.client.config.colors.EMBED_COLOR)
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(embed);
      } catch {
        return message.reply(
          "please make sure you're running this command in the current starboard channel if you're trying to disable/change the channel."
        );
      }
    }

    message.client.starboardsManager.create(message.channel, {
      allowNsfw: true,
      starBotMsg: true,
      selfStar: true,
      starEmbed: true,
      color: message.client.config.colors.EMBED_COLOR
    });

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`${message.client.config.helpers.CHECK_MARK} Success!`)
      .setDescription(`The starboard for this guild has been set as ${message.channel}.`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  }
};
