const { MessageEmbed } = require(`discord.js`);
module.exports = {
  name: "lock",
  async execute(message, args) {
    const settings = await message.client.models.guild.findOne(
      {
        guildID: message.guild.id
      },
      async (err, settings) => {
        if (err) console.error(err);
        if (err) message.client.utils.sentry.captureException(err);

        if (settings.event_logs == null) {
          return message
            .reply("you need to set a logging channel before using any moderation commands.")
            .then((m) => m.delete({ timeout: 5000 }));
        }

        const channel = getChannelFromMention(args[0]) ? getChannelFromMention(args[0]) : message.channel.id;

        const reason = args.join(" ");

        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
          return message.channel.send("You need manage channel permissons!");
        }

        try {
          message.guild.channels.cache.get(channel).updateOverwrite(message.guild.id, {
            SEND_MESSAGES: false
          });
        } catch (err) {
          console.error(err);
          message
            .reply("I was unable to lock this channel, please check my permissions and try again.")
            .then((m) => m.delete({ timeout: 5000 }));
          return message.client.utils.sentry.captureException(err);
        }

        let lockembed = new MessageEmbed()
          .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
          .setTitle(`🔒 Channel Lockdown`)
          .addField("Channel: ", `${message.channel.name} (<#${message.channel.id}>)`, true)
          .addField("Reason: ", `${reason ? reason : "No reason has been set."}`, true)
          .setColor(message.client.config.colors.EMBED_COLOR)
          .setTimestamp()
          .setFooter(`Locked by ${message.author.tag}`, message.author.displayAvatarURL());
        message.channel.send(lockembed);
        const log_channel = await message.client.channels.fetch(settings.event_logs);
        log_channel.send(lockembed);
      }
    );

    function getChannelFromMention(mention) {
      if (!mention) return;

      if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention.slice(2, -1);

        if (mention.startsWith("!")) {
          mention = mention.slice(1);
        }
      } else {
        return;
      }
    }
  }
};
