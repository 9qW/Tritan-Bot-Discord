const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "inf-deleteall",
  premium: true,
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      return message
        .reply("you don't have enough permission to view this member's infractions.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    let target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

    if (!target)
      return message
        .reply("I can't find that user, they have to be in your guild for me to access their data.")
        .then((m) => m.delete({ timeout: 5000 }));
    if (target.id == message.member.id)
      return message.channel
        .send(`${message.client.config.helpers.ERROR_X} You can't clear warnings for yourself.`)
        .then((m) => m.delete({ timeout: 5000 }));

    message.client.models.infractions
      .deleteMany({ TargetID: target.id })
      .then(() => {
        const embed = new MessageEmbed();
        embed.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
        embed.setTitle("Successfully Cleared Infractions");
        embed.setDescription(`All infractions have been removed from <@!${target.id}>. (ID ${target.id})`);
        embed.setTimestamp();
        embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
        embed.setColor(message.client.config.colors.EMBED_COLOR);
        return message.channel.send(embed);
      })
      .catch((err) => {
        console.log("Inf-Delete All Error:", err);
        message.client.utils.sentry.captureException(err);
        return message.channel
          .send("Error when deleting infractions.", err)
          .then((m) => m.delete({ timeout: 5000 }));
      });
  }
};
