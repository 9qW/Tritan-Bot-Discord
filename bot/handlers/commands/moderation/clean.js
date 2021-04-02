const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clean",
  aliases: ["purge"],
  description: "Clear 0-99 messages",
  usage: "(Prefix)clean [0-99]",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      let mPermEmbed = new MessageEmbed()
        .setTitle("Missing Permissions")
        .setDescription(
          `${message.client.config.helpers.ERROR_X} Error, unable to clear messages.` +
            " <@" +
            message.author.id +
            "> does not have the correct permissions to run this command."
        )
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(mPermEmbed).then((m) => m.delete({ timeout: 5000 }));
    }
    const amount = parseInt(args[0]) + 1;
    if (isNaN(amount)) {
      return message
        .reply("that doesn't seem to be a valid number\nTry running `*clean #`")
        .then((m) => m.delete({ timeout: 5000 }));
    } else if (amount <= 1 || amount > 100) {
      return message
        .reply("you need to input a number between 1 and 99.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    message.channel.bulkDelete(amount, true).catch((err) => {
      console.error(err);
      message.client.utils.sentry.captureException(err);
      return message
        .reply(`There was an error trying to clear messages in this channel! Error: \`${err.message}\``)
        .then((m) => m.delete({ timeout: 5000 }));
    });

    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle("🗑️ Bulk Delete:")
      .setDescription(`${args[0]} messages have been cleared in <#${message.channel.id}>.`)
      .setColor(message.client.config.colors.EMBED_MSGDELETED_COLOR)
      .setFooter(`Member ID: ${message.author.id}`, message.guild.iconURL())
      .setTimestamp();
    return message.channel.send(embed).then((m) => m.delete({ timeout: 5000 }));
  }
};
