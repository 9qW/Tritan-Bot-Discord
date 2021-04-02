## Importing thingies
import os 
import discord 
import random 
import asyncio
from discord_slash import SlashCommand 
from discord.ext import commands 
from discord_slash.utils import manage_commands
from config import *

## Intents
intents = discord.Intents.default()
intents.members = True

## Define the bot class
class OwOMyBot(commands.Bot):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

## Client Options
client = OwOMyBot(command_prefix="*", case_insensitive = True, intents = intents)
slash = SlashCommand(client, sync_commands=True)
client.remove_command('help') 

## On Ready
async def on_ready(self):
    print(f"Logged in as {client.user}")
    owohello = client.get_channel(CONTROL_CHANNEL)
    embed=discord.Embed(title="🟢 The slash client has connected.", color=0x7289DA)
    await owohello.send(embed=embed)

## Cogs
for filename in os.listdir('./cogs'):
    if filename.endswith('.py'):
        client.load_extension(f'cogs.{filename[:-3]}')
        print(f'Loaded {filename[:-3]}')

## Cog Loading
@client.command(aliases=['lo'])
async def load(ctx, extension):
    if ctx.author.id in DEVS:
        client.load_extension(f'cogs.{extension}')
        await ctx.message.reply(f"Loaded {extension}")

## Cog Unloading
@client.command(aliases=['unlo'])
async def unload(ctx, extension):
    if ctx.author.id in DEVS:
        client.unload_extension(f'cogs.{extension}')
        await ctx.message.reply(f"Unloaded {extension}")

## Cog Reloading
@client.command(aliases=['relo'])
async def reload(ctx, extension):
    if ctx.author.id in DEVS:
        client.unload_extension(f'cogs.{extension}')
        client.load_extension(f'cogs.{extension}')
        await ctx.message.reply(f"Reloaded {extension}")

# - Slashy Lashy - #


@slash.slash(name="dev", description="This is a test command.")
async def _dev(ctx):
  if ctx.author.has_role(792593736076099634):
    await ctx.send("Poggers :white_check_mark:")
  else:
    await ctx.send("You no use this :(")


## Slash Commands: Ping
@slash.slash(name="ping", description='What else would this be for ;-;')
async def _ping(ctx): 
    '''Tf else do you think this is for?'''
    embed=discord.Embed(title = "Ping", description = "Ponged back the ping in {0:.2f}ms!".format(client.latency * 1000), color=0x7289DA)
    embed.set_author(name = client.user, icon_url = "https://cdn.tritan.gg/tritan-bot/logo.webp")
    embed.set_thumbnail(url=ctx.author.avatar_url)
    embed.set_footer(text = "Requested by: {}".format(ctx.author), icon_url = ctx.author.avatar_url_as(size=128))
    await ctx.send(embed=embed)

## Slash Commands: Lock Channel
#@slash.slash(name="Lock", description="Locks a channel", options=[manage_commands.create_option("channel", "The channel you want to lock.", SlashCommandOptionType.CHANNEL, True), manage_commands.create_option("reason", "the reason for locking the channel", SlashCommandOptionType.STRING, True)])
#async def _lock(ctx, channel, reason):
#  if ctx.author.guild_permissions.administrator == True:
#    await ctx.channel.set_permissions(
#    ctx.guild.default_role, send_messages=False)
#    embed = discord.Embed(title=":warning: Channel has been locked!",description="Moderation action",  color=0x7289DA)
#    embed.add_field(
#    name=(f"{ctx.author} has locked this channel!"),
#    value=(f"{reason}"))
#    await ctx.send(embeds=[embed])
#  else:
#    await ctx.send("You aren't an administrator!")

## Slash Command: Add Role
#@slash.slash(name="addrole", description="Gives a user a role,", options=[manage_commands.create_option("user", "the user you want to assign the role to.", SlashCommandOptionType.USER, True), manage_commands.create_option("role", "the role you're giving.", SlashCommandOptionType.ROLE, True)])
#async def _addrole(ctx, user, role):
#  if ctx.author.guild_permissions.administrator == True:
#    await user.add_roles(role)
#    embed=discord.Embed(title=":gift: Role given", description=f"{role} has been given to {user}",  color=0x7289DA)
#    await ctx.send(embeds=[embed])
#  else:
#    await ctx.send("You aren't an administrator!")

## Slash Commands: Remove Role
#@slash.slash(name="removerole", description="Removes a role from a user.", options=[manage_commands.create_option("user", "the user you're removing the role from", SlashCommandOptionType.USER, True), manage_commands.create_option("role", "the role you want to remove.", SlashCommandOptionType.ROLE, True)])
#async def _removerole(ctx, user, role):
#  if ctx.author.guild_permissions.administrator == True:
#    await user.remove_roles(role)
#    embed=discord.Embed(title=":white_check_mark: Role removed", description="{role} has been removed from {user}",  color=0x7289DA)
#    await ctx.send(embeds=[embed])
#  else:
#    await ctx.send("You aren't an administrator!")


## Slash Commands: Unlock Channel
#@slash.slash(name="unlock", description="unlocks a channel", options=[manage_commands.create_option("channel", "The channel you want to lock.", SlashCommandOptionType.CHANNEL, True), manage_commands.create_option("reason", "the reason for unlocking the channel", SlashCommandOptionType.STRING, True)])
#async def _unlock(ctx, channel, reason):
#  if ctx.author.guild_permissions.administrator == True:
#    await ctx.channel.set_permissions(
#    ctx.guild.default_role, send_messages=True)
#    embed = discord.Embed(title=":white_check_mark: Channel has been unlocked!",description="Moderation action",  color=0x7289DA)
#    embed.add_field(
#    name=(f"{ctx.author} has unlocked this channel!"),
#    value=(f"{reason}"))
#    await ctx.send(embeds=[embed])
#  else:
#    await ctx.send("You aren't an administrator!")

## Slash Commands: Announce to Channel
#@slash.slash(name="announce", description="Makes an announcement.", options=[manage_commands.create_option("channel", "The channel you want to send the announcement to.", SlashCommandOptionType.CHANNEL, True), manage_commands.create_option("message", "your message", SlashCommandOptionType.STRING, True)])
#async def _announce(ctx, channel, message):
#  if ctx.author.guild_permissions.administrator == True:
#    await channel.send(f"{message}")
#  else:
#    await ctx.send("You aren't an administrator!")

## Slash Commands: Guild Permissions
#@slash.slash(name='guildperms')
#async def _guildperms(self, ctx, *, member: discord.Member=None):
#    """A simple command which checks a members Guild Permissions.
#    If member is not provided, the author will be checked."""
#    if not member:
#        member = ctx.author
#    perms = '\n'.join(perm for perm, value in member.guild_permissions if value)
#    embed = discord.Embed(title='Permissions for:', description=ctx.guild.name, colour=member.colour, color=0x7289DA)
#    embed.set_author(icon_url=member.avatar_url, name=str(member))
#    embed.add_field(name='\uFEFF', value=perms)
#    await ctx.send(content=None, embed=embed)

## Slash Commands: Owoify
@slash.slash(name = "owoify", description = "owoifies your text ><", options = [manage_commands.create_option(
    name = "text",
    description = "text",
    option_type = 3,
    required = True
)])
async def _owowo(ctx, msg: str):
    '''owo'''
    vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']

    def last_replace(s, old, new):
        li = s.rsplit(old, 1)
        return new.join(li)

    def text_to_owo(text):
        """ Converts your text to OwO """
        smileys = [';;w;;', '^w^', '>w<', 'UwU', '(・`ω\´・)', '(´・ω・\`)']

        text = text.replace('L', 'W').replace('l', 'w')
        text = text.replace('R', 'W').replace('r', 'w')

        text = last_replace(text, '!', '! {}'.format(random.choice(smileys)))
        text = last_replace(text, '?', '? owo')
        text = last_replace(text, '.', '. {}'.format(random.choice(smileys)))

        for v in vowels:
            if 'n{}'.format(v) in text:
                text = text.replace('n{}'.format(v), 'ny{}'.format(v))
            if 'N{}'.format(v) in text:
                text = text.replace('N{}'.format(v), 'N{}{}'.format('Y' if v.isupper() else 'y', v))

        return text

    await ctx.send(text_to_owo(msg))


## Client Login
client.run(TOKEN)
