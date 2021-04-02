module.exports = {
  name: "password",
  aliases: ["pass"],
  async execute(message, args) {
    function generatePassword() {
      var length = 16,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    }

    const waiting = await message.channel.send(
      `<a:birb:763086846908956682> Please wait, hashing a random password for you.`
    );

    message.author.send(`:detective: Here's your requested password: ${generatePassword()}`);

    waiting.edit(`The random hashed password has been DM'd to you.`);
  }
};
