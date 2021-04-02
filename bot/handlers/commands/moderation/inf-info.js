const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "inf-info",
  async execute(message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      return message
        .reply("you don't have enough permission to view this member's infractions.")
        .then((m) => m.delete({ timeout: 5000 }));
    }
    let target = args[0];
    if (!target)
      return message
        .reply("You need to send an infraction ID for me to send back information.")
        .then((m) => m.delete({ timeout: 5000 }));
    const page = parseInt(args[1]) || 1;
    let warnings = await message.client.models.infractions
      .find({ _id: target })
      .limit(50)
      .skip((page - 1) * 50);
    if (warnings.length == 0)
      return message.channel
        .send("There are no infractions for this user.")
        .then((m) => m.delete({ timeout: 5000 }));

    const embed = new MessageEmbed();
    embed.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
    embed.setTitle(`Infraction Info: ${target}`);
    embed.setTimestamp();
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setColor(message.client.config.colors.EMBED_COLOR);
    warnings.map((warning) => {
      embed.addField(
        `ID:\`${warning._id}\``,
        `Guild Name: \`${warning.GuildName}\n\`Guild ID: \`${warning.GuildID}\n\`Member Name: \`${warning.TargetTag}\n\`Member ID: \`${warning.TargetID}\n\`Type: \`${warning.InfractionType}\n\`Moderator: \`${warning.ModeratorTag}\n\`Moderator ID: \`${warning.ModeratorID}\n\`Reason: \`${warning.Reason}\n\``
      );
    });
    return message.channel.send(embed);
  }
};
