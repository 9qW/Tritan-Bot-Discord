const { MessageEmbed } = require("discord.js");
const ms = require("parse-ms");
const check = require("../../../utils/functions/create");
const addBalance = require("../../../utils/functions/addBalance");

module.exports = {
  name: "daily",
  async execute(message, client) {
    let user = message.author;
    let timeout = 39600000;
    let amount = 20;

    check(user.id).then(async (wallet) => {
      let daily = wallet.daily;

      if (daily !== null && timeout - (Date.now() - daily) > 0) {
        let time = ms(timeout - (Date.now() - daily));
        let totalCoins = wallet.balance;

        let timeEmbed = new MessageEmbed();
        timeEmbed.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
        timeEmbed.setTitle("Daily Award");
        timeEmbed.setThumbnail(message.author.displayAvatarURL());
        timeEmbed.setDescription(
          `You've already collected your daily reward today. You can collect it again in ${time.hours}h ${time.minutes}m ${time.seconds}s `
        );
        timeEmbed.addField(`Current Balance:`, totalCoins);
        timeEmbed.setColor(message.client.config.colors.EMBED_COLOR);
        timeEmbed.setTimestamp();
        timeEmbed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

        message.channel.send(timeEmbed);
      } else {
        let totalCoins = wallet.balance;

        let moneyEmbed = new MessageEmbed();
        moneyEmbed.setAuthor(
          `Tritan Bot`,
          "https://cdn.discordapp.com/attachments/732766998345285712/744305778399117476/8bd897f7fce9469a670f494768f21dec.jpg"
        );
        moneyEmbed.setTitle("Daily Streaks");
        moneyEmbed.setThumbnail(message.author.displayAvatarURL());
        moneyEmbed.setDescription(
          `Thanks for being awesome! You just collected your daily reward of ${amount} coins!`
        );
        moneyEmbed.addField(`💰 Today's Reward:`, amount);
        moneyEmbed.addField(`🤑 Previous Balance:`, totalCoins);
        moneyEmbed.setColor(message.client.config.colors.EMBED_COLOR);
        moneyEmbed.setTimestamp();
        moneyEmbed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

        await addBalance(wallet.userId, amount).then((callWallet) => {
          message.channel.send(moneyEmbed);
        });

        const wallet_ = require("../../../models/economy");

        await wallet_.updateOne({ userId: user.id }, { $set: { daily: Date.now() } });
      }
    });
  }
};
