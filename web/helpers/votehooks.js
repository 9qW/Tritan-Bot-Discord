// Imports
const { WebhookClient, MessageEmbed } = require("discord.js");
const chalk = require("chalk");
const DBL = require("dblapi.js");

// Import Config
const { EMBED_COLOR } = require("../config/colors");
const webhooks = require("../config/webhooks");
const misc = require("../config/misc");
const tokens = require("../config/tokens");

// Import Models
const economyModel = require("../models/economy");

// Pass Client
module.exports = (client) => {
  const webhookClient = new WebhookClient(
    webhooks.BOT_VOTES_CHANNEL_WEBHOOK_ID,
    webhooks.BOT_VOTES_CHANNEL_WEBHOOK_SECRET
  );

  const dbl = new DBL(client, {
    webhookPort: misc.VOTE_WEBHOOK_PORT,
    webhookAuth: tokens.topGG_webhookAuth
  });

  dbl.webhook.on("ready", (hook) => {
    console.log(
      chalk.yellowBright("[WEB STARTUP]"),
      `DBL Votes Webhook running on port ${misc.VOTE_WEBHOOK_PORT}.`
    );
  });

  dbl.webhook.on("vote", async (vote) => {
    const isInDB = await economyModel.findOne({ userId: vote.user });
    if (isInDB) {
      const user = await economyModel.findOne({ userId: vote.user });

      user.balance += misc.VOTE_REWARD;
      user
        .save()
        .then((result) => console.log(result))
        .catch((e) => console.log(e));
      console.log();
    }

    const isInGuild = client.guilds.cache.get(misc.SUPPORT_SERVER_ID).members.cache.get(vote.user);
    if (isInGuild) {
      let role = client.guilds.cache
        .get(misc.SUPPORT_SERVER_ID)
        .roles.cache.find((role) => role.id == misc.VOTE_ROLE);

      client.guilds.cache.get(misc.SUPPORT_SERVER_ID).members.cache.get(vote.user).roles.add(role);

      setTimeout(function () {
        client.guilds.cache.get(misc.SUPPORT_SERVER_ID).members.cache.get(vote.user).roles.remove(role);
      }, 86400000); //24 hours

      let voteUserDiscord = client.users.cache.get(vote.user);

      let voteEmbed = new MessageEmbed();
      if (voteUserDiscord) {
        voteEmbed.setAuthor(voteUserDiscord.tag, voteUserDiscord.displayAvatarURL());
        voteEmbed.setTitle("New Vote");
      }
      if (!voteUserDiscord) {
        voteEmbed.setAuthor(`New Vote`);
      }
      voteEmbed.setThumbnail("http://cdn.tritan.gg/tritan-bot/icon.webp");
      voteEmbed.setDescription(
        `<@!${vote.user}>, thank you for supporting us by voting on top.gg! For your support, we've awarded you **${misc.VOTE_REWARD} coins in our economy section.**\n\n If you're in our support server, you've been given the hoisted **I Voted Role** role for 24 hours to show off! \n\n[Vote For Tritan Bot](https://top.gg/bot/732783297872003114/vote)`
      );
      voteEmbed.setColor(EMBED_COLOR);
      voteEmbed.setTimestamp();

      client.users.cache.get(vote.user).send(voteEmbed);
      webhookClient
        .send({
          username: "Tritan Bot",
          avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
          embeds: [voteEmbed]
        })
        .catch(console.error);
    }
  });
};
