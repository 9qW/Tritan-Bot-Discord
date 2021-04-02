module.exports = {
  name: "roulette",
  description: "Would you rather",
  execute(message, client) {
    const answer = [
      "🚬🔫 You're safe... for now.",
      "🚬🔫 You're safe... for now.",
      "🚬🔫 You're safe... for now.",
      "🚬🔫 You're safe... for now.",
      "🚬🔫 You're safe... for now.",
      "🔥🔫 You died."
    ];
    return message.channel.send(answer[Math.floor(Math.random() * answer.length)]);
  }
};
