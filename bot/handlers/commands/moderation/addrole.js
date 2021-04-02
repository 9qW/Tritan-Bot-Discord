module.exports = {
  name: "addrole",
  description: "Adds a role to a member",
  Usage: "addrole {user mention} {role name}",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message
        .reply("you don't have enough permission to manage this member's roles.")
        .then((m) => m.delete({ timeout: 5000 }));
    }

    if (!message.guild.member(message.client.user).hasPermission("MANAGE_ROLES"))
      return message.channel.send(
        `${message.client.config.helpers.ERROR_X} **Error:** I don't have the **Manage Roles** permission!`
      );

    if (message.mentions.users.size === 0)
      return message.channel.send(
        `${message.client.config.helpers.ERROR_X} Please mention a user to give the role to.\nExample: *addrole @user Members`
      );

    let member = message.guild.member(message.mentions.users.first());
    if (!member)
      return message.channel.send(
        `${message.client.conig.helpers.ERROR_X} **Error:** That user does not seem valid.`
      );

    let rname = message.content.split(" ").splice(2).join(" ");
    let role = message.guild.roles.cache.find((val) => val.name === rname);
    if (!role)
      return message.reply(
        `${message.client.config.helpers.ERROR_X} **Error:** ${rname} isn't a role on this server!`
      );

    let botRolePosition = message.guild.member(message.client.user).roles.highest.position;
    let rolePosition = role.position;
    let userRolePossition = message.member.roles.highest.position;

    if (userRolePossition <= rolePosition)
      return message.channel.send(
        `${message.client.config.helpers.ERROR_X} **Error:** Failed to add the role to the user because your role is lower than the specified role.`
      );

    if (botRolePosition <= rolePosition)
      return message.channel.send(
        `${message.client.config.helpers.ERROR_X} **Error:** Failed to add the role to the user because my highest role is lower than the specified role.`
      );

    member.roles.add(role).catch((e) => {
      return message.channel.send(`${message.client.config.helpers.ERROR_X} **Error:**\n${e}`);
    });

    message.channel.send(
      `${message.client.config.helpers.CHECK_MARK} **${
        message.author.username
      }**, I've added the **${rname}** role to **${message.mentions.users.first().username}**.`
    );
  }
};
