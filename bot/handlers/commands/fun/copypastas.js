module.exports = {
  name: "copypasta",
  description: "Sends a funny nsfw copypasta",
  usage: "(Prefix)copypasta",
  premium: true,
  async execute(message, client) {
    if (!message.channel.nsfw) {
      return message.reply("I can only run this in an nsfw channel.");
    }
    return message.channel.send(
      `${message.client.utils.copypastas[Math.floor(Math.random() * message.client.copypastas.length)]}`
    );
  }
};
