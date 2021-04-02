const { spawn } = require("child_process");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dev.pull",
  description: "Developer use only.",
  usage: "(Prefix)dev.pull",
  devOnly: true,
  async execute(message, args, client) {
    if (!args[0]) {
      const dataCommand = new MessageEmbed()
        .setTitle(`The git repo is now pulling to the client.`)
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.colors.EMBED_COLOR);

      const msg = await message.channel.send(dataCommand);
      const gitCmd = spawn("git", ["pull"]);

      gitCmd.stdout.on("data", (data) => {
        dataCommand.addField("Out:", `\`\`\` ${data} \`\`\``);
        msg.edit("", dataCommand);
      });

      gitCmd.stderr.on("data", (data) => {
        dataCommand.addField("Info:", `\`\`\` ${data} \`\`\``);
        msg.edit("", dataCommand);
      });

      gitCmd.on("error", (error) => {
        errorEmbed.addField("Error:", `\`\`\`${error}\`\`\``);
        msg.edit("", dataCommand);
      });

      gitCmd.on("close", (code) => {
        return;
      });
    } else if (args[0] === "-text") {
      const msg = await message.channel.send("The git repo is now pulling to the client.");
      const gitCmd = spawn("git", ["pull"]);

      gitCmd.stdout.on("data", (data) => {
        message.channel.send(`\`\`\` Out: ${data} \`\`\``);
      });

      gitCmd.stderr.on("data", (data) => {
        message.channel.send(`\`\`\` Info: ${data} \`\`\``);
      });

      gitCmd.on("error", (error) => {
        message.channel.send(`\`\`\`Error: ${error}\`\`\``);
      });

      gitCmd.on("close", (code) => {
        return;
      });
    }
  }
};
