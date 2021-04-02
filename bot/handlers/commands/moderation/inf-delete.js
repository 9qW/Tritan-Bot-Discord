const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "inf-delete",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      return message
        .reply("you don't have enough permission to view this member's infractions.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    const caseID = args[0];
    if (!caseID)
      return message.channel
        .send(`${message.client.config.helpers.ERROR_X} You need to specify the infraction ID.`)
        .then((m) => m.delete({ timeout: 5000 }));

    message.client.models.infractions
      .findByIdAndDelete(caseID)
      .then(async (document) => {
        if (!document)
          return message.channel.send("That is an invalid caseID!").then((m) => m.delete({ timeout: 5000 }));

        if (document.user == message.member.id) {
          const newinf = new message.client.models.infractions({
            _id: document._id,
            GuildID: document.GuildID,
            GuildName: document.GuildName,
            TargetID: document.TargetID,
            TargetTag: document.TargetTag,
            ModeratorID: document.ModeratorID,
            ModeratorTag: document.ModeratorTag,
            InfractionType: document.InfractionType,
            Reason: document.Reason,
            Time: document.Time
          });
          await newinf.save();
          return message.channel
            .send("You can't delete warnings from yourself!")
            .then((m) => m.delete({ timeout: 5000 }));
        } else {
          const embed = new MessageEmbed();
          embed.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
          embed.setTitle("Successfully Deleted Infraction");
          embed.setDescription(`Infraction ${caseID} has been removed from our records.`);
          embed.setTimestamp();
          embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
          embed.setColor(message.client.config.colors.EMBED_COLOR);
          return message.channel.send(embed).then((m) => m.delete({ timeout: 5000 }));
        }
      })
      .catch((err) => {
        console.log("Inf-Delete Error:", err);
        message.client.utils.sentry.captureException(err);
        return message.channel
          .send("Error when deleting infraction, please try again later.\n" + err)
          .then((m) => m.delete({ timeout: 5000 }));
      });
  }
};
