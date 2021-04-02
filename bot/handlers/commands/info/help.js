const { MessageEmbed } = require("discord.js");
const rm = require("discord.js-reaction-menu");
const mongoose = require("mongoose");

module.exports = {
  name: "help",
  aliases: ["h", "commands"],
  description: "Lists all commands for the bot.",
  usage: "(Prefix)help",
  async execute(message) {
    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });
    new rm.menu({
      channel: message.channel,
      userID: message.author.id,
      time: 300000,
      pages: [
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Tritan Bot: Help",
          description: `Tritan Bot is a general purpose discord bot! Listed below are all the commands we currently offer, broken up by category.\n\n**${message.guild.name}**'s current prefix is \`${settings.prefix}\`.\n\n**Reaction Options:**\n:rewind: - First Page\n:arrow_backward: - Back\n:arrow_forward: - Next Page\n:fast_forward: - Last Page\n:stop_button: - Close`,
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: "Links:",
              value:
                "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fapi%2Fcallback&scope=bot%20applications.commands) | " +
                "[Support Server](https://discord.gg/ScUgyE2)** | " +
                "**[Website](https://tritan.gg)** | " +
                "**[Status Page](https://status.tritan.gg)**"
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Music Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}play {Song Title or URL}`,
              value: `This command will play a specific song in the voice channel you are currently in.`
            },
            {
              name: `${settings.prefix}search {Song Title}`,
              value: `This command will search for a specific song to play in the voice channel that you are currently in.`
            },
            {
              name: `${settings.prefix}pause`,
              value: `This command will pause the currently playing song.`
            },
            {
              name: `${settings.prefix}resume`,
              value: `This command will unpause the currently paused song.`
            },
            {
              name: `${settings.prefix}lyrics`,
              value: `This command will display the lyrics for the currently playing song.`
            },
            {
              name: `${settings.prefix}shuffle`,
              value: `If you have enough music in the queue, this command will shuffle the order of songs playing in the queue.`
            },
            {
              name: `${settings.prefix}playing`,
              value: `This command shows information about the currently playing song.`
            },
            {
              name: `${settings.prefix}skipto {Queue Number}`,
              value: `This command will skip to a specific number in the queue.`
            },
            {
              name: `${settings.prefix}playlist {Name or URL}`,
              value: `This command will queue up to 25 songs in a playlist (youtube or soundcloud.`
            },
            {
              name: `${settings.prefix}queue`,
              value: `This command lists all of the songs that are currently up playing next, along with their queue number.`
            },
            {
              name: `${settings.prefix}remove {Queue Number}`,
              value: `This command will remove a song from the queue.`
            },
            {
              name: `${settings.prefix}volume {1-100%}`,
              value: `This command will set the volume of music playing from 1-10.`
            },
            {
              name: `${settings.prefix}skip`,
              value: `This command will skip the currently playing song.`
            },
            {
              name: `${settings.prefix}loop`,
              value: `This command will loop the currently playing song until turned off.`
            },
            {
              name: `${settings.prefix}bump {song number}`,
              value: `Move a song to the top of the queue.\nUsage: (Prefix)move <Queue Number>`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Fun Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}trivia`,
              value: `This command will ask you a trivia question and you answer with reactions`
            },
            {
              name: `${settings.prefix}advice`,
              value: `This command will give you some random advice.`
            },
            {
              name: `${settings.prefix}concrete`,
              value: `This command gives you facts about concrete. :)`
            },
            {
              name: `${settings.prefix}horoscope {sun sign}`,
              value: `This command gives you a daily horoscope based on the sign given.`
            },
            {
              name: `${settings.prefix}fact`,
              value: `This command will give you a randomly fetched fact.`
            },
            {
              name: `${settings.prefix}chuck`,
              value: `This command will return a random Chuck Norris joke!`
            },
            {
              name: `${settings.prefix}catfact`,
              value: `This command will give you a randomly fetched fact about cats.`
            },
            {
              name: `${settings.prefix}dogfact`,
              value: `This command will give you a randomly fetched fact about dogs.`
            },
            {
              name: `${settings.prefix}8ball`,
              value: `This command will give you a random 8ball style answer.`
            },
            {
              name: `${settings.prefix}coinflip`,
              value: `Flip a coin, and it will land on either 'heads' or 'tails'`
            },
            {
              name: `${settings.prefix}rps {rock, paper, scissors}`,
              value: `Try your luck and play rock, paper, scissors against Tritan!`
            },
            {
              name: `${settings.prefix}topic`,
              value: `This command will give you a randomly generated topic to speak about in your guild.`
            },
            {
              name: `${settings.prefix}quote`,
              value: `This command will fetch an inspirational quote.`
            },
            {
              name: `${settings.prefix}weakmeme`,
              value: `This command will fetch a weak meme.`
            },
            {
              name: `${settings.prefix}meme`,
              value: `This command will fetch a fire meme from reddit.`
            },
            {
              name: `${settings.prefix}bubblewrap`,
              value: `Pop the bubblewrap!`
            },
            {
              name: `${settings.prefix}asciify {text}`,
              value: `Ascii'ify your text to annoy other server members!`
            },
            {
              name: `${settings.prefix}tictactoe`,
              value: `Play a game of tic tac toe!`
            },
            {
              name: `${settings.prefix}ppsize`,
              value: `Find out what Tritan thinks about you :o`
            },
            {
              name: `${settings.prefix}roulette`,
              value: `Play russian roulette against Tritan Bot.`
            },
            {
              name: `${settings.prefix}reverse {word}`,
              value: `Reverse a word!`
            },
            {
              name: `${settings.prefix}luckycolor`,
              value: `Figure out your lucky color :o`
            },
            {
              name: `${settings.prefix}vaporwave {text}`,
              value: `Space some text out to make it look vaporwaveish.`
            },
            {
              name: `${settings.prefix}copypasta`,
              value: `Gives you a weird copypasta, maybe.`
            },
            {
              name: `${settings.prefix}ai {query}`,
              value: `Talk to an AI that's not cleverbot!`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Utility Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}avatar [mention]`,
              value: `This command will fetch the image of your avatar, or a mentioned user's avatar.`
            },
            {
              name: `${settings.prefix}serverinfo`,
              value: `This command will give you server info based from the server the command was ran in.`
            },
            {
              name: `${settings.prefix}userinfo [mention]`,
              value: `This command will give helpful user information about yourself or a mentioned user.`
            },
            {
              name: `${settings.prefix}servericon`,
              value: `This command will fetch the link and image of the server's icon that the command was ran in.`
            },
            {
              name: `${settings.prefix}serverstats`,
              value: `This command will fetch server stats about the server the command was ran in.`
            },
            {
              name: `${settings.prefix}embed`,
              value: `This command is a very easy to use embed builder! It gives you all the options a regular embed would have, interactively.`
            },
            {
              name: `${settings.prefix}randomnumber`,
              value: `This command will provide you a random number.`
            },
            {
              name: `${settings.prefix}start-giveaway`,
              value: `This command will start a random reaction based giveaway! Command options are presented once you run the command.`
            },
            {
              name: `${settings.prefix}end-giveaway {Message ID}`,
              value: `This command will end a reaction based giveaway! Command options are presented once you run the command.`
            },
            {
              name: `${settings.prefix}reroll-giveaway {Message ID}`,
              value: `This command will reroll a reaction based giveaway! Command options are presented once you run the command.`
            },
            {
              name: `${settings.prefix}remind {time} [reminder]`,
              value: `${settings.prefix}remind 2h disboard bump\n**Alias:** r`
            },
            {
              name: `${settings.prefix}reminders`,
              value: `Lists all of your active reminders, along with their ID's.\n**Alias:** rlist`
            },
            {
              name: `${settings.prefix}rdelete {Reminder ID}`,
              value: `Deletes an active reminder.`
            },
            {
              name: `${settings.prefix}id {mention}`,
              value: `This command will fetch the Discord ID of a mentioned user.`
            },
            {
              name: `${settings.prefix}suggest {your suggestion goes here}`,
              value: `This command will post a suggestion into the dedicated suggestions channel.`
            },
            {
              name: `${settings.prefix}approve [suggestion ID:] {reason}`,
              value: `This command will send an approval message in the dedicated suggestions channel for suggestion listed.`
            },
            {
              name: `${settings.prefix}deny [suggestion ID:] {reason}`,
              value: `This command will send a denial message in the dedicated suggestions channel for the suggestion listed.`
            },
            {
              name: `${settings.prefix}rolelist {role name, not mentioned}`,
              value: `This command will fetch all of the members in a given role. When writing the roles name, capital letters do matter.`
            },
            {
              name: `${settings.prefix}roleinfo {role mention}`,
              value: `This command will list information about the mentioned role.`
            },
            {
              name: `${settings.prefix}afk {reason}`,
              value: `This command will mark you as AFK. If you are pinged while this command is active, Tritan will respond with a message that states why.`
            },
            {
              name: `${settings.prefix}pastebin {your text}`,
              value: `Send text to a pastebin for your viewing later.`
            },
            {
              name: `${settings.prefix}password`,
              value: `DM's you a randomly hashed password that is up to 10 characters.`
            },
            {
              name: `${settings.prefix}covid19`,
              value: `Show global COVID-19 Statistics`
            },
            {
              name: `${settings.prefix}start-vote {question}`,
              value: `This command will start a 2 minute vote, and it will tally the results.`
            },
            {
              name: `${settings.prefix}duckduckgo {search terms}`,
              value: `This command will return an internet search from DuckDuckGo.`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Moderation Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}clean {number of messages}`,
              value: `This command will clear up to 99 messages at a time in a specific channel.`
            },
            {
              name: `${settings.prefix}kick {mention or ID}`,
              value: `This command will kick a user, while also logging the kick and messaging the kicked user with the reason.`
            },
            {
              name: `${settings.prefix}ban {mention or ID}`,
              value: `This command will ban a user, while also logging the ban and messaging the banned member with the reason.`
            },
            {
              name: `${settings.prefix}warn {mention or ID} {reason}`,
              value: `This command will warn a user, while also logging the warn and messaging the warned user with the reason.`
            },
            {
              name: `${settings.prefix}lock {reason}`,
              value: `Lock a channel for a specific reason, this command denies @everyone the ability to send messages.`
            },
            {
              name: `${settings.prefix}unlock {reason}`,
              value: `Unlock a locked channel for a specific reason, this command allows @everyone the ability to send messages.`
            },
            {
              name: `${settings.prefix}fetchbans`,
              value: `Fetch the amount of banned people within your guild.`
            },
            {
              name: `${settings.prefix}inf-search {@username or ID}`,
              value: `Lists the 10 most recent infractions given to a member.`
            },
            {
              name: `${settings.prefix}inf-staff {@username or ID}`,
              value: `Lists the 10 most recent infractions given by a specific staff member.`
            },
            {
              name: `${settings.prefix}inf-info {Infraction ID}`,
              value: `Lists the 10 most recent infractions given by a specific staff member.`
            },
            {
              name: `${settings.prefix}inf-delete {Infraction ID}`,
              value: `Delete a single infraction by ID`
            },
            {
              name: `${settings.prefix}inf-deleteall {@username or ID}`,
              value: `Delete all infractions for a specific member.`
            },
            {
              name: `${settings.prefix}note-add {@username or ID} {note}`,
              value: `Add a note to a specific member.`
            },
            {
              name: `${settings.prefix}voicemute {@username}`,
              value: `Voice-mutes a specific member.`
            },
            {
              name: `${settings.prefix}voiceunmute {@username}`,
              value: `Voice-unmutes a specific member.`
            },
            {
              name: `${settings.prefix}nick {@username} {new nickname}`,
              value: `Change the nickname for a specific user in your guild.`
            },
            {
              name: `${settings.prefix}addrole {@username} {role name}`,
              value: `Adds a role to a specific user`
            },
            {
              name: `${settings.prefix}removerole {@username} {role name}`,
              value: `Removes a role from a specific user.`
            },
            {
              name: `${settings.prefix}mute {mention}`,
              value: `Mute a specific member.`
            },
            {
              name: `${settings.prefix}unmute {mention}`,
              value: `Unmutes a specific member.`
            },
            {
              name: `${settings.prefix}reason {infraction id} {new reason}`,
              value: `Change the reason on a specific infraction.`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Image/Gif Manipulation Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}cuddle {mention}`,
              value: `Tag someone who you would like to cuddle.`
            },
            {
              name: `${settings.prefix}cat`,
              value: `This command will fetch a random image of a cat.`
            },
            {
              name: `${settings.prefix}dog`,
              value: `This command will fetch a random image of a cute doggo.`
            },
            {
              name: `${settings.prefix}hug {mention}`,
              value: `Tag someone who you would like to hug.`
            },
            {
              name: `${settings.prefix}kiss {mention}`,
              value: `Tag someone who you would like to kiss.`
            },
            {
              name: `${settings.prefix}pat {mention}`,
              value: `Tag someone who you would like to pat on the back.`
            },
            {
              name: `${settings.prefix}poke {mention}`,
              value: `Tag someone who you would like to poke.`
            },
            {
              name: `${settings.prefix}slap {mention}`,
              value: `Tag someone who you would like to give a good ole' slap.`
            },
            {
              name: `${settings.prefix}spank {mention}`,
              value: `Tag someone who you would like to spank.`
            },
            {
              name: `${settings.prefix}tickle {mention}`,
              value: `Tag someone who you would like to tickle.`
            },
            {
              name: `${settings.prefix}bird`,
              value: `This command fetches a random image of a bird.`
            },
            {
              name: `${settings.prefix}duck`,
              value: `This command fetches a random image of a cute duck.`
            },
            {
              name: `${settings.prefix}fox`,
              value: `This command fetches a random image of a fox.`
            },
            {
              name: `${settings.prefix}wallpaper`,
              value: `This command fetches a random wallpaper.`
            },
            {
              name: `${settings.prefix}clyde {text}`,
              value: `Make Clyde say something to you. :)`
            },
            {
              name: `${settings.prefix}ph {text}`,
              value: `Generate a pornhub comment from your text.`
            },
            {
              name: `${settings.prefix}captcha {mention}`,
              value: `Generate a captcha for someone.`
            },
            {
              name: `${settings.prefix}tweet {name} {text}`,
              value: `Make a fake tweet from any user!`
            },
            {
              name: `${settings.prefix}jealous {ID 1} {ID 2}`,
              value: `A nice graphic to show that someones a little jelly.`
            },
            {
              name: `${settings.prefix}trumptweet {text}`,
              value: `Tweet from Trump's account!`
            },
            {
              name: `${settings.prefix}changemymind {text}`,
              value: `The change my mind meme, but with your text.`
            },
            {
              name: `${settings.prefix}deepfry {mention}`,
              value: `Deepfry someones avatar image!`
            },
            {
              name: `${settings.prefix}blurplify {mention}`,
              value: `Blurplify someones avatar image!`
            },
            {
              name: `${settings.prefix}trash {mention}`,
              value: `Trash someones avatar image!`
            },
            {
              name: `${settings.prefix}threats {mention}`,
              value: `Show discord the biggest 3 threats to society!`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Image/Gif Manipulation Commands (Part 2)",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}wasted {optional mention/id}`,
              value: `Get wasted, lol.`
            },
            {
              name: `${settings.prefix}glossy {optional mention/id}`,
              value: `Sends a glossy version of someones profile photo.`
            },
            {
              name: `${settings.prefix}color {hex code}`,
              value: `Returns an image of a specific hex code. Run with no arguments for an example.`
            },
            {
              name: `${settings.prefix}triggered {optional mention/id}`,
              value: `Did someone just get triggered?`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Bot Configuration",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}setlogs`,
              value: `This command will give you instructions on how to turn on Tritan's logging.`
            },
            {
              name: `${settings.prefix}joinleave`,
              value: `This command will give you instructions on how to turn on Tritan's Join/Leave logging.`
            },
            {
              name: `${settings.prefix}muterole {role mention}`,
              value: `Set the mute role for your guild.`
            },
            {
              name: `${settings.prefix}rankchannel`,
              value: `Set a channel to enable ranking and leaderboards in your guild`
            },
            {
              name: `${settings.prefix}bumpconfig`,
              value: `Enable (or disable) bump reminders, they are turned on by default.`
            },
            {
              name: `${settings.prefix}levelrewards`,
              value: `Enable role rewards for leveling based on message and server xp.`
            },
            {
              name: `${settings.prefix}starchannel`,
              value: `Enable or disable the starboard channel in your server.`
            },
            {
              name: `${settings.prefix}autodelete`,
              value: `Enable or change the a channel for auto deletion of all messages, useful for bot channels.`
            },
            {
              name: `${settings.prefix}autodeletedisable`,
              value: `Disable the auto deletion channel in your guild.`
            }
          ]
        }),

        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Informative Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}info`,
              value: `This command will give you specific information about Tritan Bot as a whole.`
            },
            {
              name: `${settings.prefix}help`,
              value: `Displays information about all current commands.`
            },
            {
              name: `${settings.prefix}invite`,
              value: `This command will give you the invite link for Tritan.`
            },
            {
              name: `${settings.prefix}support`,
              value: `This command will give you the support server invite url.`
            },
            {
              name: `${settings.prefix}ping`,
              value: `This command will provide you with the bot's latency.`
            },
            {
              name: `${settings.prefix}uptime`,
              value: `This command will provide you with the bot's uptime status.`
            },
            {
              name: `${settings.prefix}vote`,
              value: `This command will show you different websites to upvote Tritan on!`
            },
            {
              name: `${settings.prefix}setprefix {new prefix}`,
              value: `This command will let you change the prefix of the bot.`
            },
            {
              name: `${settings.prefix}shard`,
              value: `This command will provide you with what shard your server is on.`
            },
            {
              name: `${settings.prefix}stats`,
              value: `This command will provide you with statistics about Tritan Bot.`
            },
            {
              name: `${settings.prefix}developers`,
              value: `This command will provide you with a list of Tritan's developers and support team.`
            },
            {
              name: `${settings.prefix}dashboard`,
              value: `This command will provide you with a link to Tritan's dashboard.`
            },
            {
              name: `${settings.prefix}topcommands`,
              value: `This command will provide you with a list and number of Tritan's most used commands.`
            },
            {
              name: `${settings.prefix}nsfwcommands`,
              value: `Lists the NSFW commands, locked to a nsfw channel.`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Economy Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}daily`,
              value: `This command lets you start a daily streak by claiming coins every 24 hours.`
            },
            {
              name: `${settings.prefix}balance`,
              value: `This command will show you the total coin balance of the message author.`
            },
            {
              name: `${settings.prefix}richest`,
              value: `This command will show you the economy leaderboard.`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Leaderboard Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}top (leaderboard)`,
              value: `This command lets you see the top 10 ranked users in your guild..`
            },
            {
              name: `${settings.prefix}rank {optional mention}`,
              value: `This command will show you your rank card.`
            },
            {
              name: `${settings.prefix}setxp {mention} {xp}`,
              value: `This command will allow server staff to set someone's XP.`
            },
            {
              name: `${settings.prefix}setrank {mention} {level}`,
              value: `This command will allow server staff to set someone's level.`
            },
            {
              name: `${settings.prefix}topmessages`,
              value: `This command returns a link to our dashboard to display everyone's message counts in your server.`
            }
          ]
        }),
        new MessageEmbed({
          author: {
            name: "Tritan Bot",
            icon_url: "http://cdn.tritan.gg/tritan-bot/icon.webp"
          },
          title: "Developer Commands",
          color: message.client.config.colors.EMBED_COLOR,
          timestamp: new Date(),
          thumbnail: {
            url: message.guild.iconURL()
          },
          footer: {
            text: `Requested by: ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL()
          },
          fields: [
            {
              name: `${settings.prefix}dev.eval`,
              value: `Developer use only, misconduct will be logged.`
            },
            {
              name: `${settings.prefix}dev.reload [category] [command name]`,
              value: `Developer use only, misconduct will be logged.`
            },
            {
              name: `${settings.prefix}dev.status`,
              value: `Developer use only, misconduct will be logged.`
            },
            {
              name: `${settings.prefix}dev.update`,
              value: `Developer use only, misconduct will be logged.`
            },
            {
              name: `${settings.prefix}dev.resolved`,
              value: `Developer use only, misconduct will be logged.`
            },
            {
              name: `${settings.prefix}dev.blacklist {guild id}`,
              value: `Developer use only, misconduct will be logged.`
            },
            {
              name: `${settings.prefix}dev.exec`,
              value: `Developer use only, misconduct will be logged.`
            },
            {
              name: `${settings.prefix}dev.getinvite`,
              value: `Developer use only, misconduct will be logged.`
            }
          ]
        })
      ]
    });
  }
};
