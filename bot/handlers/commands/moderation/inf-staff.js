const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "inf-staff",
  premium: true,
  async execute(message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      return message.reply("you don't have enough permission to view this member's infractions.");
    }

    let target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (!target)
      return message
        .reply(
          "I can't find that user, they have to be in your guild to access their data. Try using the dashboard for a list of all infractions."
        )
        .then((m) => m.delete({ timeout: 5000 }));
    const page = parseInt(args[1]) || 1;
    let warnings = await message.client.models.infractions
      .find({ ModeratorID: target.id, GuildID: message.guild.id })
      .limit(50)
      .skip((page - 1) * 50);
    if (warnings.length == 0)
      return message.channel
        .send(`${message.client.config.helpers.ERROR_X} There are no infractions for this user.`)
        .then((m) => m.delete({ timeout: 5000 }));

    const embed = new MessageEmbed();
    embed.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
    embed.setTimestamp();
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setColor(message.client.config.colors.EMBED_COLOR);

    if (!target.tag) target.tag = target.id;
    embed.setTitle(`Infractions Given By ${target.tag}`);

    warnings.map((warning) => {
      embed.addField(
        `ID:\`${warning._id}\``,
        `Member: \`${warning.TargetTag}\n\`Type: \`${warning.InfractionType}\n\`Moderator: \`${warning.ModeratorTag}\n\`Reason: \`${warning.Reason}\n\`Time/Date: \`${warning.Time}\n\``
      );
    });
    return message.channel.send(embed);
  }
};
