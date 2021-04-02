const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const mongoose = require("mongoose");

module.exports = {
  name: "rdelete",
  async execute(message, args) {
    if (!args[0])
      return message.reply("Please run the `reminders` command and then try again with the reminder ID.");

    const reminder = await message.client.models.reminders.findOne({
      _id: args[0]
    });

    try {
      await reminder.updateOne({
        active: false
      });

      let cancel = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "https://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Reminder Canceled:")
        .setDescription(`Your reminder has be canceled.`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Reminder ID: ${args[0]}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(`<@!${message.author.id}>`, cancel);
    } catch (e) {
      message.reply(`I'm having issues finding that reminder, please try again later.`);
      console.error("REMINDER DELETE ERROR: ", e);
    }
  }
};
