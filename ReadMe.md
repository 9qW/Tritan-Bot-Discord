<h2 align='center'>
  <img src="https://cdn.tritan.gg/tritan-bot/logo.webp" height='100px' width='100px' />
<br>
Tritan Bot </h2>
  <p align="center">
 Tritan Bot is a Discord Verified general purpose bot built with discord.js and express (yes, it has a dashboard included). Please read through the <a href='https://docs.tritan.gg'>docs</a> before even thinking about running this yourself. </p>
  <p align="center">
        <a href="https://tritan.gg/support">
      <img src="https://img.shields.io/badge/Maintained%20by:-Team%20Tritan%20%E2%86%92-gray.svg?colorA=655BE1&colorB=4F44D6&style=for-the-badge"/>
    </a>
          <a href="https://tritan.gg/">
      <img src="https://img.shields.io/badge/Library:-Discord.js%20%E2%86%92-gray.svg?colorA=655BE1&colorB=4F44D6&style=for-the-badge"/>
    </a>
          <a href="https://tritan.gg/">
      <img src="https://img.shields.io/badge/Version:-5.0.1%20%E2%86%92-gray.svg?colorA=655BE1&colorB=4F44D6&style=for-the-badge"/>
     </a>
          <a href="https://tritan.gg/">
      <img src="https://img.shields.io/badge/Library:-Discord.js%20%E2%86%92-gray.svg?colorA=655BE1&colorB=4F44D6&style=for-the-badge"/>
    </a>
            <a href="https://tritan.gg/support">
      <img src="https://img.shields.io/badge/Support:-Discord Server%20%E2%86%92-gray.svg?colorA=655BE1&colorB=4F44D6&style=for-the-badge"/>
    </a>            
        
  </p>

<h2> Important: Read Me</h2>

You can self-host Tritan Bot, however you must follow the licensing by not changing any original credits- as well as giving credit in your version of the bot via embed footers, website footers, etc. I have no problem with use of this open souce project for learning purposes, as long as you contribute for any nias changes via a pull request and you give credit to this github repo. I decided to make Tritan open source to teach people, so please just try to learn from the code instead of just copying it ;-;. 

<h2>Can I add Tritan Bot to my server?</h2>

[![Discord Bots](https://top.gg/api/widget/status/732783297872003114.svg)](https://top.gg/bot/732783297872003114)
[![Discord Bots](https://top.gg/api/widget/servers/732783297872003114.svg)](https://top.gg/bot/732783297872003114)
[![Discord Bots](https://top.gg/api/widget/upvotes/732783297872003114.svg)](https://top.gg/bot/732783297872003114/vote)

Yes, please go [here](https://tritan.gg/invite) to invite the bot. If you require support, or you would like to give any feedback or suggestions, please join [the support server](https://discord.gg/ScUgyE2).

<h2> Documentation </h2>

While there is no documentation to run Tritan Bot yourself because it's not suggested, please visit [this website](https://wiki.tritan.gg) for more information on the commands and setup available.

<h2> Features & Commands </h2>

> Note: The default prefix is `*`

- Play music from YouTube via url
- Play music from YouTube via search query
- Play music from Soundcloud via url
- Search and select music to play
- Play youtube playlists via url
- Play youtube playlists via search query
- Now Playing
- Queue system
- Loop / Repeat
- Shuffle
- Volume control
- Lyrics
- Pause
- Resume
- Skip to song # in queue
- Help Command
- Media Controls via Reactions
- Enhanced Logging
- Easy to Use Utilities
- Necessary but Enhanced Infractions
- Join/Leave Logging
- Ban Logging
- Unban Logging
- Kick Logging
- Channel Creation/Deletion Logging
- Channel Update Logging
- Role Creation/Deletion Logging
- Role Update Logging
- Deleted Message Logging
- Message Purging with Logs
- Gifs for everything
- Fact commands
- Topic commands
- Memes
- Quotes
- Suggestions
- User information
- Fetch User ID
- Fetch Avatar
- Moderation Tools
- Clean, Kick, Ban, Warn
- AFK System
- and many more commands!

<h2> Should I Run Tritan Bot Locally? </h2>

Probably not. Tritan Bot has enough moving pieces that running a local version is complicated. The main purpose of having the source released is to allow others to understand and audit the functionality. The code is by no means meant to be easy to setup or bootstrap, and I don't plan on supporting folks trying to run locally. That said, feel free to run a local version of Tritan for your server (but not a public version please).

<h2> Self-hosting Agreement </h2>

- You may not use the Tritan logo or name within derivative bots.
- You may not host a public version of Tritan Bot.
- You may not charge for the usage of your instance of Tritan Bot.
- You may not provide support for Tritan Bot.
- You may not remove any credits to the original author anywhere within this bot. I know what code I've written, and I will recognize it.

<h2> Requirements </h2>

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
2. YouTube Data API v3 Key **[Guide](https://developers.google.com/youtube/v3/getting-started)**  
   2.1 **(Optional)** Soundcloud Client ID **[Guide](https://github.com/zackradisic/node-soundcloud-downloader#client-id)**
3. Node.js v12.0.0 or newer
4. At least 4GB of Ram
5. MongoDB **[Guide](https://docs.atlas.mongodb.com/tutorial/deploy-free-tier-cluster/)**
6. Dedicated IP

<h2> Note: </h2>

```As the creator and developer, I fully 100% support running this through docker. Do as you wish, I've included instructions for both the docker-compose and standalone way.```

<h2> Getting Started  - Standalone</h2>

```
git clone https://github.com/dylanjamesdev/Tritan-Bot-Discord.git
cd Tritan-Bot-Discord
cd bot
npm i
cd ../ && cd web
npm i
```

<h2> Configuration  - Standalone</h2>

```
You will need to fill in everything that is blank in the `config` directory. It can be confusing, but it's super easy once you know what you're doing. If you require any assistance please join our support server.
```

<h2> Start Up - Standalone</h2>

After installation finishes you can use pm2 to run this bot and web dashboard seperately. You must start these scripts from within their own directory, using `node ../../../index.js` will NOT work!

```
cd ../bot
pm2 start index.js --name Tritan-Sharding
-- pm2 stop Tritan-Sharding
-- pm2 restart Tritan-Sharding

Then

(Web) Dashboard:
cd ./web
pm2 start index.js --name Tritan-Web
-- pm2 stop Tritan-Web
-- pm2 restart Tritan-Web

pm2 save
pm2 startup
```

<h2> Running with Docker Compose </h2>

- Install Docker and Docker Compose
- Fill out all required config files.
- Run `docker-compose up`, and watch the magic happen.

<h2> Contributing </h2>

**Can I contribute?**

Maybe. Feel free to submit PRs and issues, but unless they are explicitly bug fixes that have good documentation and clean code, I likely won't merge. Features will not be accepted through PR unless stated elsewhere. Do not submit feedback on this repository, the server is the right place for that. PRs focused around the frontend and web panel are more likely to be accepted.

1. [Fork the repository](https://github.com/dylanjamesdev/Tritan-Bot-Discord.git)
2. Clone your fork: `git clone https://github.com/your-username/Tritan-Bot-Discord.git`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request

<h2> Credits </h2>

- Tritan Bot is currently being maintained by [Team Tritan](https://gitlab.com/team-tritan) and their team of contributing developers.
- Created by Dylan James.
- Contributed to by Windows, Crafterzman, Nirlep, and MaximKing.
