const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "embed",
  aliases: ["embed-maker", "em"],
  description: "Make your own embeds with Tritan's easy to use embed builder!",
  usage: "(Prefix)embed",
  premium: true,
  async execute(message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.channel
        .send("You do not have the required permission to use this command.")
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 3000);
        });
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
    message.reply("What should the title of the embed be? if none then type `none`");
    let title = await message.channel.awaitMessages((res) => res.author.id === message.author.id, {
      max: 1,
      time: 60000
    });
    if (title.size) {
      if (title.first().content !== "none") {
        if (title.first().length > 256)
          return message.reply("Title can not exceed 256 characters.").then((message) =>
            message.delete({
              timeout: 5000
            })
          );
        embed.setTitle(title.first().content);
      }
    }
    message.reply("What should the description of the embed be? if none then type `none`");
    let description = await message.channel.awaitMessages((res) => res.author.id === message.author.id, {
      max: 1,
      time: 60000
    });
    if (description.size) {
      if (description.first().content !== "none") {
        if (description.first().length > 2048)
          return message.reply("Description can not exceed 2048 characters.").then((message) =>
            message.delete({
              timeout: 5000
            })
          );
        embed.setDescription(description.first().content);
      }
    }
    message.reply("What should the image of the embed be? if none then type `none`");
    let image = await message.channel.awaitMessages((res) => res.author.id === message.author.id, {
      max: 1,
      time: 60000
    });
    if (image.size) {
      if (image.first().content !== "none") {
        if (!/\.(jpe?g|png|gif)$/i.test(image.first().content)) {
          return message.reply("that was not a valid URL.").then((message) =>
            message.delete({
              timeout: 5000
            })
          );
        }
        embed.setImage(image.first().content);
      }
    }
    message.reply("What should the thumbnail of the embed be? if none then type `none`");
    let thumbnail = await message.channel.awaitMessages((res) => res.author.id === message.author.id, {
      max: 1,
      time: 60000
    });
    if (thumbnail.size) {
      if (thumbnail.first().content !== "none") {
        embed.setThumbnail(thumbnail.first().content);
      }
    }
    message.reply("What should the color of the embed be? Enter a hex color. (#000000)");
    let color = await message.channel.awaitMessages((res) => res.author.id === message.author.id, {
      max: 1,
      time: 60000
    });
    embed.setColor(color.first().content);
    message.reply("What should the footer of the embed be? if none then type `none`");
    let footer = await message.channel.awaitMessages((res) => res.author.id === message.author.id, {
      max: 1,
      time: 60000
    });
    if (footer.size) {
      if (footer.first().content !== "none") {
        if (footer.first().length > 2048)
          return message.reply("Footer can not exceed 2048 characters.").then((message) =>
            message.delete({
              timeout: 5000
            })
          );
        embed.setFooter(
          footer.first().content + ` | Requested by ${message.author.username}`,
          message.author.displayAvatarURL()
        );
      }
    }
    message.channel.bulkDelete(12);
    message.channel.send(embed);
  }
};
