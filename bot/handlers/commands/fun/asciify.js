const figlet = require("figlet");

module.exports = {
  name: "asciify",
  alias: ["ascii"],
  description: "Asciify some text!",
  usage: "*asciify {test}",
  execute(message, args, client) {
    var inputText = args.slice(0).join(" ");
    var reply;
    figlet.text(
      inputText,
      {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default"
      },
      function (err, data) {
        if (err) {
          message.channel.send("Something went wrong...");
          console.error(err);
        } else if (inputText.length > 0) {
          message.channel.send("```" + data + "```");
        } else {
          let finalEmbedMessage = new MessageEmbed()
            .setColor(message.client.config.colors.EMBED_COLOR)
            .addField("Syntax Error", "No Text Specified");
          message.channel.send(finalEmbedMessage);
        }
      }
    );
  }
};
