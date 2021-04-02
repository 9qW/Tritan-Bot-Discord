const { Collection, MessageEmbed, WebhookClient } = require("discord.js");
const Levels = require("discord-xp");
const Statcord = require("statcord.js");
const chalk = require("chalk");
const mongoose = require("mongoose");
const cache = require("quick.db");

const Beautify = require("js-beautify").js_beautify;
const cleanCodeExp = new RegExp(/([`]{3})clean-code([^```]*)([`]{3})/g);
const beautifyOptions = require("../../utils/jsbeautify.json");

module.exports = async (client, message) => {
  const errorWebhook = new WebhookClient(
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  );

  const controlWebhook = new WebhookClient(
    client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_ID,
    client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_SECRET
  );

  if (message.author.bot) {
    return;
  }

  if (message.channel.type == "dm") {
    let embed = new MessageEmbed()
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
      .setTitle("DM Received:")
      .addField(`Member:`, `<@!${message.author.id}> (${message.author.id})`)
      .addField("Message:", message.content, false)
      .setTimestamp()
      .setColor(client.config.colors.EMBED_COLOR);
    controlWebhook.send({
      username: "Tritan Bot",
      avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
      embeds: [embed]
    });
  }

  if (!message.guild) {
    let embed = new MessageEmbed()
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
      .setTitle("DM Received:")
      .setDescription(
        "Hi there! Sadly you can't run commands in the DMs. Also note that any messages you have sent will been sent to my developers, not the guild that may have issued an infraction."
      )
      .addField("Bot Support", "[Click Here](https://tritan.gg/support)")
      .setTimestamp()
      .setColor(client.config.colors.EMBED_COLOR);
    return message.reply(embed);
  }

  const settings = await client.models.guild.findOne(
    {
      guildID: message.guild.id
    },
    (err, guild) => {
      if (err) console.error(err);
      if (!guild) {
        const newGuild = new client.models.guild({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          guildName: message.guild.name,
          guildCreated: message.guild.createdAt,
          prefix: client.config.helpers.DEFAULT_PREFIX,
          is_premium: false,
          is_blacklisted: false,
          event_logs: null,
          join_leave: null,
          mute_role: null,
          betaGuild: false,
          messageCount: 1,
          disabledBumpReminders: false,
          auto_delete_channel: null
        });
        newGuild
          .save()
          .then((result) => console.log(result))
          .catch((err) => console.error(err));
        return message.channel
          .send(
            "This server was not in our database! We have now added and you should be able to use bot commands."
          )
          .then((m) =>
            m.delete({
              timeout: 10000
            })
          );
      }
    }
  );

  if (settings.is_blacklisted) {
    message.channel.send("...why am I in a blacklisted guild?");

    message.guild.leave();

    let embed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle(`❌ Left Blacklisted Guild`)
      .addField(`Server Name:`, message.guild.name, false)
      .addField(`Guild ID:`, message.guild.id, false)
      .addField(`Guild Member Count:`, message.guild.memberCount, false)
      .addField(`Shard:`, message.guild.shardID, false)
      .setColor(client.config.colors.EMBED_GUILDDELETE_COLOR)
      .setTimestamp()
      .setFooter("Tritan Bot");

    controlWebhook.send({
      username: "Tritan Bot",
      avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
      embeds: [embed]
    });
  }

  const memberMessages = await client.models.messages.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  });

  if (!memberMessages) {
    const newMember = new client.models.messages({
      _id: mongoose.Types.ObjectId(),
      guildID: message.guild.id,
      userID: message.author.id,
      messageCount: 1
    });
    newMember.save().catch((error) => console.error(error));
  }

  if (memberMessages) {
    memberMessages.messageCount += 1;
    memberMessages.save().catch((error) => console.error(error));
  }

  let afk = new cache.table("AFKs");
  let mentioned = message.mentions.members.first();
  if (mentioned) {
    let status = await afk.fetch(mentioned.id);
    if (status) {
      const AFKembed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setColor(client.config.colors.EMBED_COLOR)
        .setDescription(`The user mentioned above (${mentioned.user.tag}) is in AFK mode.`)
        .addField(`Reason:`, `**${status}**`)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
      message.channel.send(AFKembed).catch(console.error);
    }
  }
  if (afk) {
    const status = new cache.table("AFKs");
    let afk = await status.fetch(message.author.id);
    if (afk) {
      const embed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setDescription("You are no longer in AFK mode.")
        .setTimestamp()
        .setColor(client.config.colors.EMBED_COLOR)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
      message.channel.send(`<@!${message.author.id}>`, embed);
      status.delete(message.author.id);
    }
  }

  if (message.mentions.everyone || message.mentions.roles.first()) {
    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setColor(client.config.colors.EMBED_MASSPING_COLOR)
      .setTitle("📣 Mass Ping:")
      .addField(`Author:`, message.author.tag)
      .addField(`Sent Message:`, message)
      .addField("Channel:", "<#" + message.channel + "> (" + message.channel.name + ")")
      .setTimestamp()
      .setFooter("ID: " + message.author.id);

    const thisWebhook = await client.models.webhooks.findOne({
      guildID: settings.guildID,
      channelID: settings.event_logs
    });

    if (thisWebhook) {
      const webhookClient = new WebhookClient(thisWebhook.webhookID, thisWebhook.webhookSecret);

      try {
        return await webhookClient.send({
          username: "Tritan Bot",
          avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
          embeds: [embed]
        });
      } catch {
        return await client.models.webhooks.findOneAndDelete({
          guildID: settings.guildID,
          channelID: settings.event_logs
        });
      }
    }
  }

  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
  const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
  if (settings.rank_channel) {
    if (hasLeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`\`${message.author.tag}\` has leveled up to rank **${user.level}**. :tada:`)
        .setColor(client.config.colors.EMBED_COLOR);

      const thisWebhook = await client.models.webhooks.findOne({
        guildID: settings.guildID,
        channelID: settings.rank_channel
      });

      if (thisWebhook) {
        const webhookClient = new WebhookClient(thisWebhook.webhookID, thisWebhook.webhookSecret);

        try {
          return await webhookClient.send({
            username: "Tritan Bot",
            avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
            embeds: [embed]
          });
        } catch {
          return await client.models.webhooks.findOneAndDelete({
            guildID: settings.guildID,
            channelID: settings.rank_channel
          });
        }
      }
    }
  }

  if (!settings.disabledBumpReminders) {
    if (message.content == "!d bump") {
      const Disboard = message.guild.members.cache.get("302050872383242240");
      if (!Disboard) {
        return;
      }
      let bumpEmbed = new MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Thanks for your support! I'll remind you once you can bump again.")
        .setTimestamp()
        .setColor(message.client.config.colors.EMBED_COLOR);
      message.channel.send(`<@!${message.author.id}>`, bumpEmbed);

      setTimeout(function () {
        let bumpReminder = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle(
            "It's been two hours, you should be able to bump the server again (unless someone else already has)."
          )
          .setTimestamp()
          .setColor(client.config.colors.EMBED_COLOR);
        message.channel.send(`<@!${message.author.id}>`, bumpReminder);
      }, 7200000);
    }
  }

  if (cleanCodeExp.test(message.content)) {
    message.delete().catch(console.error);
    var res = `<@!${message.author.id}>, I've formatted that for you.\n${message.content}`;
    var code = message.content.match(cleanCodeExp);
    for (var i = 0; i < code.length; i++) {
      var rawCode = code[i].substr(13, code[i].length - 16);
      var originalCode = rawCode;
      var prettyCode = Beautify(originalCode, beautifyOptions);
      res = res.replace(originalCode, prettyCode);
    }

    res = res.replace(/(clean-code)/g, "javascript\n");
    message.channel.send(res).catch(console.error);
  }

  if (settings.auto_delete_channel) {
    if (
      message.channel.id === settings.auto_delete_channel &&
      !message.content.includes(settings.auto_delete_keyword)
    ) {
      message.delete({
        timeout: 1000
      });
    }
  }

  let fuckmedaddy = settings.prefix;

  if (!message.content.startsWith(fuckmedaddy)) return;
  const args = message.content.slice(fuckmedaddy.length).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  client.models.commands
    .findOne({
      commandName: commandName
    })
    .then(async (c) => {
      if (!c) {
        const newCommand = new client.models.commands({
          commandName: commandName,
          timesUsed: 0
        });
        await newCommand.save().catch((e) => client.log(e));
        c = await client.models.commands.findOne({
          commandName: commandName
        });
      }
      c.timesUsed += 1;
      await c.save().catch((e) => client.log(e));
    });

  Statcord.ShardingClient.postCommand(commandName, message.author.id, client);

  if (client.config.helpers.BLACKLISTED_USERS.includes(message.author.id)) {
    message.react(client.config.helpers.ERROR_X);

    message.channel.send(
      `<@!${message.author.id}>, you have been blacklisted from this bot (most likely due to abuse). If you any questions, please reach out to the developers.\nhttps://tritan.gg/support`
    );

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Blacklisted User Alert")
      .addField("User", message.author.tag + ` (ID: ${message.author.id})`, true)
      .addField("Guild", message.guild.name + ` (ID: ${message.guild.id})`, true)
      .addField("Command", commandName, true)
      .setColor(client.config.colors.EMBED_COLOR)
      .setTimestamp();

    return controlWebhook.send({
      username: "Tritan Alerts",
      avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
      embeds: [embed]
    });
  }

  if (command.inBeta && !settings.betaGuild) {
    message.react(client.config.helpers.ERROR_X);

    message.reply(
      "this command is for beta guilds only. Please reach out in our support server to enable this setting."
    );

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Unauthorized Beta Command Alert")
      .addField("User", message.author.tag + ` (ID: ${message.author.id})`, true)
      .addField("Guild", message.guild.name + ` (ID: ${message.guild.id})`, true)
      .addField("Command", commandName, true)
      .setColor(client.config.colors.EMBED_COLOR)
      .setTimestamp();

    return controlWebhook.send({
      username: "Tritan Alerts",
      avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
      embeds: [embed]
    });
  }

  if (command.devOnly && !client.config.helpers.DEVELOPER_IDS.includes(message.author.id)) {
    message.react(client.config.helpers.ERROR_X);

    message.reply("this command can only be used by authorized developers.");

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle("Unauthorized Developer Command Alert")
      .addField("User", message.author.tag + ` (ID: ${message.author.id})`, true)
      .addField("Guild", message.guild.name + ` (ID: ${message.guild.id})`, true)
      .addField("Command", commandName, true)
      .setColor(client.config.colors.EMBED_COLOR)
      .setTimestamp();

    return controlWebhook.send({
      username: "Tritan Alerts",
      avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
      embeds: [embed]
    });
  }

  if (command.premium && !settings.is_premium) {
    let premiumEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`${client.config.helpers.ERROR_X} Premium Not Enabled`)
      .setDescription(
        `You tried running a premium command in a server that isn't premium. Please consider supporting Tritan Bot's development by donating for a premium subscription.`
      )
      .addField(`Get Premium`, `[Click Me](https://tritan.gg/#premium)`)
      .addField(`Get Support`, `[Click Me](https://tritan.gg/support)`)

      .setColor(client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.reply(premiumEmbed);
  }

  if (command.nsfw && !message.channel.nsfw) {
    let nsfw = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setTitle(`${client.config.helpers.ERROR_X} Channel Not NSFW`)
      .setDescription(`You tried running a nsfw command in a sfw channel, please don't do it again. :p`)
      .setColor(client.config.colors.EMBED_COLOR)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(nsfw);
  }

  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 10) * 1000;

  if (timestamps.has(message.author.id)) {
    if (!client.config.helpers.DEVELOPER_IDS.includes(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        let embed = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle("Cooldown Alert")
          .addField("User", message.author.tag + ` (ID: ${message.author.id})`, true)
          .addField("Guild", message.guild.name + ` (ID: ${message.guild.id})`, true)
          .addField("Command", commandName, true)
          .addField("Cooldown", timeLeft, true)
          .setColor(message.client.config.colors.EMBED_COLOR)
          .setTimestamp();

        controlWebhook.send({
          username: "Tritan Alerts",
          avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
          embeds: [embed]
        });

        let embed2 = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setDescription(
            `You are currently on command cooldown, please wait \`${timeLeft}\` more seconds before reusing this command.`
          )
          .setTimestamp()
          .setColor(client.config.colors.EMBED_COLOR)
          .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());

        return message.reply(embed2);
      }
    }
  }

  if (!client.config.helpers.DEVELOPER_IDS.includes(message.author.id)) {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    command.execute(message, args, client);

    message.react(client.config.helpers.CHECK_MARK);

    message.delete({
      timeout: 10000
    });
  } catch (error) {
    message.react(client.config.helpers.ERROR_X);

    console.error(chalk.redBright("[Command Error]"), error);

    client.utils.sentry.captureException(error);

    let errorEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setDescription(
        "This command did not run successfully, please run `*support` to tell a developer in my support server."
      )
      .addField("Command Name:", `${commandName}`)
      .addField("Error Debugging:", `${error}`)
      .addField("Guild Name:", `${message.guild.name}`)
      .addField("Guild ID:", `${message.guild.id}`)
      .addField("Channel Name:", `${message.channel.name}`)
      .addField("Channel ID:", `${message.channel.id}`)
      .addField("Message Author:", `${message.author}`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor("#FFFF00");

    message.reply(errorEmbed);

    errorWebhook.send({
      username: "Tritan Errors",
      avatarURL: "http://cdn.tritan.gg/tritan-bot/icon.webp",
      embeds: [errorEmbed]
    });
  }
};
