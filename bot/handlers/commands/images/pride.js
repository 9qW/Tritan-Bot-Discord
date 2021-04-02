const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pride",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply("mention someone to overlay the pride flag.");

    const m = await message.channel.send(`<a:birb:763086846908956682> Please wait, fetching from the API.`);

    const lewdembed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setImage(
        `http://api.teamtritan.wtf/api/v1/canvas/gay?pfp=https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg?size=128`
      )
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.colors.EMBED_COLOR);
    m.edit(null, lewdembed);
  }
};
