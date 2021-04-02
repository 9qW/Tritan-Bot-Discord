const { MessageEmbed } = require("discord.js");
const moment = require("moment");

const option = {
  true: "Yes",
  false: "No"
};

module.exports = {
  name: "roleinfo",
  aliases: ["role-info"],
  description: "Displays information about a provided role.",
  usage: "(Prefix)roleinfo [Role mention]",
  async execute(message, args) {
    const role = message.mentions.roles.first() || message.client.roles.cache.get(args[0]);
    if (!role) {
      return message.channel.send("Please specify a role by mention or ID.");
    }

    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, fetching role info from the API.`
    );

    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setDescription(`**Role Info: ${role.name}**`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .addField("General", [
        `**❯ Name:** ${role.name}`,
        `**❯ ID:** ${role.id}`,
        `**❯ Hex Color:** ${role.hexColor.toUpperCase()}`,
        `**❯ Created on:** ${moment(role.createdTimestamp).format("Do MMMM YYYY HH:mm")}`,
        "\u200b"
      ])
      .addField("Server", [
        `**❯ Position:** ${role.position}`,
        `**❯ Hoisted:** ${option[role.hoist]}`,
        `**❯ Mentionable:** ${option[role.mentionable]}`,
        `**❯ Members:** ${role.members.size}`,
        "\u200b"
      ])
      .addField("Permissions", [
        `${role.permissions
          .toArray()
          .map((x) =>
            x
              .split("_")
              .map((y) => y[0] + y.slice(1).toLowerCase())
              .join(" ")
          )
          .join(", ")}`
      ]);
    return waiting.edit(null, embed);
  }
};
