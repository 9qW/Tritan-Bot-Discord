module.exports = {
  name: "concrete",
  description: "Crowd-sourced facts about concrete.",
  usage: "(Prefix)concrete",
  execute(message, client) {
    var randomChoice = Math.floor(Math.random() * 8 + 1);
    switch (randomChoice) {
      case 1:
        message.channel.send(
          "Reinforced concrete is the only building material that is highly resistant to both water and fire. (fact credit: @_Cadzie)"
        );
        break;
      case 2:
        message.channel.send(
          "Concrete actually gets stronger as it ages, and cures! (fact credit: @elitebuster2012)"
        );
        break;
      case 3:
        message.channel.send("The first concrete highway was built in 1909. (fact credit: @_Cadzie)");
        break;
      case 4:
        message.channel.send(
          "The best mixture for it, is one part cement, 2 sand, 3 gravel and slowly add water until  it's workable. (fact credit: @MemmeTweets)"
        );
        break;
      case 5:
        message.channel.send(
          "Concrete is held together with oxygen, so if there was none, every single building would collapse instantly. (fact credit: Meme25327)"
        );
        break;
      case 6:
        message.channel.send("It's hard. (fact credit: @JmanOSRS)");
        break;
      case 7:
        message.channel.send(
          "Cement is one of the main ingredients in concrete, and over 2 billion tons of cement is produced each year. also I'm gay. (fact credit: anon)"
        );
        break;
      case 8:
        message.channel.send(
          "Some grass and plants grow through concrete, sometimes even crack it. (fact credit: Wrtek)"
        );
        break;
    }
  }
};
