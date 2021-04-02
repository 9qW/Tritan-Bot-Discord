const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const mongoose = require("mongoose");
const client = require("discord.js");

module.exports = {
  name: "remind",
  aliases: ["r"],
  async execute(message, args) {
    if (!client.lockit) client.lockit = [];
    let time = args[0];
    let validUnlocks = ["release", "unlock"];
    if (!time) {
      const timeEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
        .setTitle(`Reminders:`)
        .setDescription(
          "Please set an amount of time you would like your reminder to be! `*remind [TIME][M-S-H] [Title]`"
        )
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.reply(timeEmbed).then((m) => {
        m.delete(20000);
      });
    }
    if (validUnlocks.includes(time)) {
      message.channel
        .updateOverwrite(message.author.id, {
          SEND_MESSAGES: true
        })
        .then(() => {
          message.channel.send(`${message.author} **Your reminder is up!**`);
          clearTimeout(client.lockit[message.channel.id]);
          delete client.lockit[message.channel.id];
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      message.channel
        .updateOverwrite(message.author.id, {
          SEND_MESSAGES: true
        })
        .then(() => {
          const newReminder = new message.client.models.reminders({
            _id: mongoose.Types.ObjectId(),
            active: true,
            authorTag: message.author.tag,
            authorID: message.author.id,
            guildID: message.guild.id,
            reminderText: args.slice(1).join(" ")
          });
          newReminder.save().then((result) => {
            const reminderID = result.id;

            const reminderSet = new MessageEmbed()
              .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
              .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
              .setTitle(`Reminders:`)
              .setDescription(
                `Gotcha! I will remind you to **${args.slice(1).join(" ")}** in **${ms(ms(time), {
                  long: true
                })}**.`
              )
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setTimestamp()
              .setFooter(`Reminder ID: ${reminderID}`, message.author.displayAvatarURL());
            message.channel.send("<@!" + message.author.id + ">", reminderSet).then(() => {
              const done = new MessageEmbed()
                .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
                .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
                .setTitle(`Reminders:`)
                .setDescription(
                  `Times up! You had asked me to remind you about "${args.slice(1).join(" ")}".`
                )
                .setColor(message.client.config.colors.EMBED_COLOR)
                .setTimestamp()
                .setFooter(`Reminder ID: ${reminderID}`, message.author.displayAvatarURL());
              client.lockit[message.channel.id] = setTimeout(async () => {
                const thisReminder = await message.client.models.reminders.findOne({
                  _id: reminderID
                });
                if (thisReminder.active === false) {
                  return delete client.lockit[message.channel.id];
                }
                if (thisReminder.active === true) {
                  await thisReminder.updateOne({
                    active: false
                  });
                }
                message.channel
                  .updateOverwrite(message.author.id, {
                    SEND_MESSAGES: true
                  })
                  .then(message.channel.send("<@!" + message.author.id + ">", done))
                  .catch(console.error);
                delete client.lockit[message.channel.id];
              }, ms(time));
            });
          });
        });
    }
  }
};
