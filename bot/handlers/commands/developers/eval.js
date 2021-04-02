const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");
const { post } = require("snekfetch");

module.exports = {
  name: "dev.eval",
  description: "Developer use only.",
  usage: "(Prefix)dev.eval",
  devOnly: true,
  async execute(message, args, client) {
    const msg = await message.channel.send(`Executing code...`);

    const code = args.join(" ");
    var evaled = null;

    try {
      evaled = eval(code);
    } catch (err) {
      evaled = false;

      const { body } = await post("https://bin.tritan.gg/documents").send(err.toString());
      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .addField("Input:", `\`\`\`js\n${code}\`\`\``)
        .addField("Error:", `\`\`\`js\n${err.toString()}\`\`\``)
        .addField("URL:", `https://bin.tritan.gg/${body.key}.js`)
        .setColor(message.client.config.colors.EMBED_EVAL_ERROR)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
      msg.edit("", embed);
      return;
    }

    if (evaled == null || evaled == false) {
      return;
    }

    if (typeof evaled !== "string") {
      evaled = require("util").inspect(evaled);
    }

    let output = eval(code);
    if (
      output instanceof Promise ||
      (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")
    )
      output = await output;
    output = inspect(output, { depth: 0, maxArrayLength: null });
    output = clean(output);
    if (output.length < 1000) {
      const { body } = await post("https://bin.tritan.gg/documents").send(output);
      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .addField("Input:", `\`\`\`js\n${code}\`\`\``)
        .addField("Output:", `\`\`\`js\n${output}\`\`\``)
        .addField("URL:", `https://bin.tritan.gg/${body.key}.js`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
      msg.edit("", embed);
    } else {
      const { body } = await post("https://bin.tritan.gg/documents").send(output);
      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Output was too long, uploaded to hastebin!")
        .setURL(`https://bin.tritan.gg/${body.key}.js`)
        .setColor(message.client.config.colors.EMBED_COLOR)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
      msg.edit("", embed).catch(async function (error) {
        await message.channel.send(`Error \`\`\`js\n${error.stack}\`\`\``);
      });
    }
  }
};

function clean(text) {
  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
}
