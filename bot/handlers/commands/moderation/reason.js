const { MessageEmbed } = require(`discord.js`);
const mongoose = require("mongoose");

module.exports = {
  name: `reason`,
  description: `Change the reason for an infraction`,
  usage: "<mention|id> <Reason>",
  async execute(message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      return message
        .reply("you don\t have enough permission to update this infraction.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    const infID = args[0];
    const newReason = args.join(" ");

    if (!infID) {
      return message.channel
        .send(`${message.client.config.helpers.ERROR_X} You need to specify the infraction ID.`)
        .then((m) => m.delete({ timeout: 5000 }));
    }

    const infractionToUpdate = message.client.models.infractions.findOne({ _id: infID });
    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    try {
      infractionToUpdate.updateOne({ reason: newReason });
    } catch (error) {
      const success = new MessageEmbed()
        .setAuthor(message.client.user.tag, message.client.user.displayAvatarURL())
        .setTitle(`${message.client.config.helpers.ERROR_X} Failed to update reason, please try again later.`)
        .addField("Error", error)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Updated by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(success);
    }

    const success = new MessageEmbed()
      .setAuthor(message.client.user.tag, message.client.user.displayAvatarURL())
      .setTitle("Update Infraction Reason")
      .addField("Updated ID & Reason", newReason, true)
      .addField("Updated By", `${message.author.tag} (${message.author.id})`, true)
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Updated by ${message.author.tag}`, message.author.displayAvatarURL());
    await message.channel.send(success);

    if (settings.event_logs) {
      const log_channel = await message.client.channels.fetch(settings.event_logs);
      log_channel.send(success);
    }
  }
};
