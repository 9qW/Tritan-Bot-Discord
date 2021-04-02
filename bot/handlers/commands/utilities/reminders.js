const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "reminders",
  aliases: ["rlist"],
  async execute(message, args) {
    let target = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!target)
      return message.channel.send(
        "I can't find that user, they have to be in your guild to access their data. Try using the dashboard for a list of all reminders."
      );
    const page = parseInt(args[1]) || 1;
    let remindersList = await message.client.models.reminders
      .find({ authorID: target.id, active: true })
      .limit(50)
      .skip((page - 1) * 50);
    if (remindersList.length == 0)
      return message.channel.send("There are no active reminders for this user at this time.");

    const embed = new MessageEmbed();
    embed.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
    embed.setTimestamp();
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setColor(message.client.config.colors.EMBED_COLOR);

    if (!target.tag) target.tag = target.id;
    embed.setTitle(`Reminders for ${target.tag}`);

    remindersList.map((remindersList) => {
      embed.addField(
        `ID: \`${remindersList._id}\``,
        `Active: \`${remindersList.active}\n\`Guild ID: \`${remindersList.guildID}\``
      );
    });
    return message.channel.send(embed);
  }
};
