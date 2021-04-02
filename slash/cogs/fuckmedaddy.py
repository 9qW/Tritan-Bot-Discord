## Import the goods
import discord
from discord.ext import commands

## Call the class
class Jsk(commands.Cog):
    def __init__(self, client):
        self.client = client
        client.load_extension("jishaku")

## Attach to client
def setup(client):
    client.add_cog(Jsk(client))
