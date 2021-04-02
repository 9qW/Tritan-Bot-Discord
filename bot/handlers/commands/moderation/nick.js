const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "nick",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) {
      let noperms = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`🔒 Change Nickname`)
        .setDescription(
          `${message.client.config.helpers.ERROR_X} You don't have permission to manage nicknames.`
        )
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.reply(noperms);
    }

    var members = message.mentions.members.array();

    if (members.length == 0) {
      let noMention = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle(`🔒 Change Nickname`)
        .setDescription(
          `${message.client.config.helpers.ERROR_X} You need to mention a user to change their nickname.`
        )
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.reply(noMention);
    }

    var name = message.content.replace(message.content.split(" ")[0], "");

    members.forEach((m) => {
      name = name.replace(`<@!${m.id}>`, "");
    });

    name = name.trim();

    members.forEach(async (m, index) => {
      var h = m.roles.highest.position;
      var y = message.guild.member(message.client.user.id).roles.highest.position;
      if (h > y || h == y) {
        let cantdo = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle(`🔒 Change Nickname`)
          .setDescription(
            `Cannot change **<@${m.id}>**'s nickname, please make sure my role is above theirs. `
          )
          .setColor(message.client.config.colors.EMBED_COLOR)
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
        return message.reply(cantdo);
        muted = false;
        members.splice(index, 1);
      } else {
        await m.setNickname(name);
      }
    });
    let success = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`🔒 Change Nickname`)
      .setDescription(`I've changed their nickname. :thumbsup:`)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.reply(success);
  }
};
