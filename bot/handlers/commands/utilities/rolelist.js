const Discord = require("discord.js");
module.exports = {
  name: "rolelist",
  aliases: ["rl"],
  description: "List everyone in a given role",
  usage: "(Prefix)rolelist [Role Name]",
  async execute(message, args) {
    let requiredPermissions = ["MANAGE_MESSAGES", "MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES"];
    let hasPermission;
    for (let permission of requiredPermissions)
      if (message.member.permissions.has(permission)) hasPermission = true;
    if (!hasPermission)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor("Tritan Bot", "https://cdn.tritan.gg/tritan-bot/icon.webp", "https://discord.gg/ScUgyE2")
          .setDescription(
            "You need the following permissions to use this command: MANAGE_MESSAGES, MANAGE_GUILD"
          )
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setColor(message.client.config.colors.EMBED_COLOR)
      );
    if (!message.guild.me.permissions.has("MANAGE_ROLES"))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor("Tritan Bot", "https://cdn.tritan.gg/tritan-bot/icon.webp", "https://discord.gg/ScUgyE2")
          .setDescription("I do not have the required permissions to execute this command.")
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setColor(message.client.config.colors.EMBED_COLOR)
      );
    args.shift();
    let input = args.join(" ").toLowerCase();
    let rid = input.replace(/\D/g, "");
    let hasid = (input.length == 22 || input.length == 18) && rid.length == 18 ? true : false;
    let fetchedRoles = await message.guild.roles.fetch();

    if (!hasid) {
      let filters = [
        [
          "Roles found with the strong filter",
          function (roles) {
            return roles.cache.filter((r) => r.name.toLowerCase().includes(input));
          }
        ],
        [
          "Roles found with the light filter",
          function (roles) {
            return roles.cache.filter((r) => r.name.toLowerCase().split(" ").join("").includes(input));
          }
        ],
        [
          "Roles found with the very weak filter",
          function (roles) {
            return roles.cache.filter((r) =>
              r.name.toLowerCase().split(" ").join("").includes(input.split(" ").join(""))
            );
          }
        ]
      ];

      let filtered = [];
      for (let filter of filters) filtered.push([filter[0], filter[1](fetchedRoles).map((r) => r)]);
      let filteredSorted = [];
      let last = [];
      for (let i = 0; i < filters.length; i++) {
        last = last.concat((filtered[i - 1] || [])[1] || []);
        let filter = filters[i];
        let roles = filtered[i][1].filter((e1) => !last.some((e2) => e2.id == e1.id));
        for (let role of roles) filteredSorted.push([filter[0], role]);
      }

      if (!(filteredSorted.length > 0))
        return message.channel.send(
          new Discord.MessageEmbed()
            .setAuthor(
              "Tritan Bot",
              "https://cdn.tritan.gg/tritan-bot/icon.webp",
              "https://discord.gg/ScUgyE2"
            )
            .setDescription("I was unable to find any results with the information provided.")
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setColor(message.client.config.colors.EMBED_COLOR)
        );
      let filteredMapped = filteredSorted.map((e) => e[1].id);
      let filteredRoles = filteredSorted.map((e) => e[1]);
      // let filteredMap = new Map();
      // for (let filteredRole of filteredSorted)
      //   filteredMap.set(
      //     filteredMapped.indexOf(filteredRole[1].id),
      //     filteredRole[1]
      //   );

      let perPage = 15;
      let totalPages = 0;

      while (totalPages * perPage - filteredSorted.length < 0) totalPages++;
      let list = async function (pageNum) {
        let toDisplay = filteredSorted.slice(perPage * pageNum, perPage + perPage * pageNum);
        let displayedSorted = {};
        for (let displayed of toDisplay)
          displayedSorted[displayed[0]]
            ? displayedSorted[displayed[0]].push(displayed[1])
            : (displayedSorted[displayed[0]] = [displayed[1]]);

        let fields = [];
        let fieldDesc = "";
        for (let filterName in displayedSorted) {
          for (let current of displayedSorted[filterName])
            fieldDesc += `${fieldDesc.length > 0 ? "\n" : ""}**\`${
              filteredMapped.indexOf(current.id) + 1
            }.\`** ${current}`;
          fields.push([filterName, fieldDesc]);
          fieldDesc = "";
        }

        let embed = new Discord.MessageEmbed()
          .setAuthor("Tritan Bot", "https://cdn.tritan.gg/tritan-bot/icon.webp", "https://discord.gg/ScUgyE2")
          .setDescription(
            "I found multiple roles matching this search, please say the number in front of the role you're looking for."
          )
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setColor(message.client.config.colors.EMBED_COLOR);

        for (let field of fields) embed.addField(field[0], field[1], field[2]);
        embed.addField(
          `Page ${pageNum + 1} of ${totalPages}`,
          `${pageNum * perPage + 1}-${pageNum * perPage + toDisplay.length} out of ${
            filteredSorted.length
          } roles.`
        );
        return embed;
      };
      let page = 0;
      let ended;
      let reactions = [
        [
          "⏮",
          totalPages > 2,
          async function (r, u) {
            if (ended) return;
            reset();
            r.users.remove(u.id);
            if (page == 0) return;
            page = 0;
            return r.message.edit(await list(page));
          }
        ],
        [
          "⬅️",
          totalPages > 1,
          async function (r, u) {
            if (ended) return;
            reset();
            r.users.remove(u.id);
            if (page == 0) return;
            page = page - 1 < 0 ? 0 : page - 1;
            return r.message.edit(await list(page));
          }
        ],
        [
          "➡️",
          totalPages > 1,
          async function (r, u) {
            if (ended) return;
            reset();
            r.users.remove(u.id);
            if (page == totalPages - 1) return;
            page = page + 1 > totalPages - 1 ? totalPages - 1 : page + 1;
            return r.message.edit(await list(page));
          }
        ],
        [
          "⏭",
          totalPages > 2,
          async function (r, u) {
            if (ended) return;
            reset();
            r.users.remove(u.id);
            if (page == totalPages - 1) return;
            page = totalPages - 1;
            return r.message.edit(await list(page));
          }
        ],
        [
          "❌",
          totalPages > 1,
          async function (r) {
            if (ended) return;
            ended = true;
            return r.message.delete().catch(() => {});
          }
        ]
      ];

      let msg = await message.channel.send(await list(0));
      let c = 0;
      let collectors = [];
      for (let i = 0; i < reactions.length; i++) {
        if (reactions[i][1]) {
          let emoji = reactions[i][0];
          setTimeout(function () {
            if (ended) return;
            msg.react(emoji);
          }, c * 500);
          c++;
          let filter = (r, u) => r.emoji.name == emoji && u.id == message.author.id;
          let collector = msg.createReactionCollector(filter);
          collector.on("collect", reactions[i][2]);
          collectors.push(collector);
        }
      }
      let maxTime = 20000;
      let timer;
      function clearCollectors() {
        ended = true;
        msg.reactions.removeAll().catch(() => {});
        for (let collector of collectors) collector.stop();
      }
      function reset() {
        clearTimeout(timer);
        timer = setTimeout(clearCollectors, maxTime);
      }
      reset();

      let responseFilter = (m) => m.author.id == message.author.id;
      let responseCollector = message.channel.createMessageCollector(responseFilter);
      collectors.push(responseCollector);
      let responseCallback = (m) => {
        if (ended) return;
        clearCollectors();
        let response = m.content.replace(/\D/g, "");
        if (!(response.length > 0))
          return message.channel.send(
            new Discord.MessageEmbed()
              .setAuthor(
                "Tritan Bot",
                "https://cdn.tritan.gg/tritan-bot/icon.webp",
                "https://discord.gg/ScUgyE2"
              )
              .setTimestamp()
              .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setDescription(
                "You must reply with **the number** in front of the role.\nPlease run the command again."
              )
          );
        if (!(response > 0))
          return message.channel.send(
            new Discord.MessageEmbed()
              .setAuthor(
                "Tritan Bot",
                "https://cdn.tritan.gg/tritan-bot/icon.webp",
                "https://discord.gg/ScUgyE2"
              )
              .setTimestamp()
              .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setDescription("The number cannot be lower than 1.\nPlease run the command again.")
          );
        if (response > filteredMapped.length)
          return message.channel.send(
            new Discord.MessageEmbed()
              .setAuthor(
                "Tritan Bot",
                "https://cdn.tritan.gg/tritan-bot/icon.webp",
                "https://discord.gg/ScUgyE2"
              )
              .setTimestamp()
              .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
              .setColor(message.client.config.colors.EMBED_COLOR)
              .setDescription(
                "The number cannot be higher than the amount of found roles.\nPlease run the command again."
              )
          );
        response = response - 1;
        let role = filteredRoles[response];
        displayRoleMembers(role);
      };
      responseCollector.on("collect", responseCallback);
    } else {
      let role = fetchedRoles.cache.get(rid);
      if (!role)
        return message.channel.send(
          new Discord.MessageEmbed()
            .setAuthor(
              "Tritan Bot",
              "https://cdn.tritan.gg/tritan-bot/icon.webp",
              "https://discord.gg/ScUgyE2"
            )
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setDescription("The ID you provided does not correspond to any role in this guild.")
        );
      displayRoleMembers(role);
    }

    async function displayRoleMembers(r) {
      let members = r.members.map((gm) => gm.user);
      if (!(members.length > 0))
        return message.channel.send(
          new Discord.MessageEmbed()
            .setAuthor(
              "Tritan Bot",
              "https://cdn.tritan.gg/tritan-bot/icon.webp",
              "https://discord.gg/ScUgyE2"
            )
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setDescription(`The role ${r} currently has no members assigned to it.`)
        );
      let membersMapped = members.map((u) => u.id);
      let perPage = 10;
      let totalPages = 0;

      while (totalPages * perPage - members.length < 0) totalPages++;
      let list = async function (pageNum) {
        let toDisplay = members.slice(perPage * pageNum, perPage + perPage * pageNum);

        let embed = new Discord.MessageEmbed()
          .setAuthor("Tritan Bot", "https://cdn.tritan.gg/tritan-bot/icon.webp", "https://discord.gg/ScUgyE2")
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setColor(message.client.config.colors.EMBED_COLOR)
          .setDescription(`Below is the list of server members with the ${r} role.`);

        let fieldTitle = "The list is shown below";
        let fieldDesc = "";
        for (let current of members)
          fieldDesc += `${fieldDesc.length > 0 ? "\n" : ""}**\`${
            membersMapped.indexOf(current.id) + 1
          }.\`** ${current}`;

        embed.addField(fieldTitle, fieldDesc);
        embed.addField(
          `Page ${pageNum + 1} of ${totalPages}`,
          `${pageNum * perPage + 1}-${pageNum * perPage + toDisplay.length} out of ${
            members.length
          } role members.`
        );
        return embed;
      };
      let page = 0;
      let ended;
      let reactions = [
        [
          "⏮",
          totalPages > 2,
          async function (r, u) {
            if (ended) return;
            reset();
            r.users.remove(u.id);
            if (page == 0) return;
            page = 0;
            return r.message.edit(await list(page));
          }
        ],
        [
          "⬅️",
          totalPages > 1,
          async function (r, u) {
            if (ended) return;
            reset();
            r.users.remove(u.id);
            if (page == 0) return;
            page = page - 1 < 0 ? 0 : page - 1;
            return r.message.edit(await list(page));
          }
        ],
        [
          "➡️",
          totalPages > 1,
          async function (r, u) {
            if (ended) return;
            reset();
            r.users.remove(u.id);
            if (page == totalPages - 1) return;
            page = page + 1 > totalPages - 1 ? totalPages - 1 : page + 1;
            return r.message.edit(await list(page));
          }
        ],
        [
          "⏭",
          totalPages > 2,
          async function (r, u) {
            if (ended) return;
            reset();
            r.users.remove(u.id);
            if (page == totalPages - 1) return;
            page = totalPages - 1;
            return r.message.edit(await list(page));
          }
        ],
        [
          "❌",
          totalPages > 1,
          async function (r) {
            if (ended) return;
            ended = true;
            return r.message.delete().catch(() => {});
          }
        ]
      ];

      let msg = await message.channel.send(await list(0));
      let c = 0;
      let collectors = [];
      for (let i = 0; i < reactions.length; i++) {
        if (reactions[i][1]) {
          let emoji = reactions[i][0];
          setTimeout(function () {
            if (ended) return;
            msg.react(emoji);
          }, c * 500);
          c++;
          let filter = (r, u) => r.emoji.name == emoji && u.id == message.author.id;
          let collector = msg.createReactionCollector(filter);
          collector.on("collect", reactions[i][2]);
          collectors.push(collector);
        }
      }
      let maxTime = 20000;
      let timer;
      function clearCollectors() {
        ended = true;
        msg.reactions.removeAll().catch(() => {});
        for (let collector of collectors) collector.stop();
      }
      function reset() {
        clearTimeout(timer);
        timer = setTimeout(clearCollectors, maxTime);
      }
      reset();
    }
  }
};
