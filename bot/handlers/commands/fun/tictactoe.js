const Discord = require("discord.js");

module.exports = {
  name: "tictactoe",
  description: ["ttc"],
  premium: true,
  execute(message, args) {
    let res = new Discord.MessageEmbed(); // 'res' will be used to send response embeds. The description will be overwritten before every use.
    const tripleTick = "```";

    let board = {
      A1: " ",
      A2: " ",
      A3: " ",
      B1: " ",
      B2: " ",
      B3: " ",
      C1: " ",
      C2: " ",
      C3: " ",
      print() {
        message.channel.send(
          `${tripleTick}Current Board:\n` +
            " " +
            this.A1 +
            " | " +
            this.A2 +
            " | " +
            this.A3 +
            " A\n" +
            "-----------\n" +
            " " +
            this.B1 +
            " | " +
            this.B2 +
            " | " +
            this.B3 +
            " B\n" +
            "-----------\n" +
            " " +
            this.C1 +
            " | " +
            this.C2 +
            " | " +
            this.C3 +
            " C\n" +
            " 1   2   3 " +
            tripleTick
        );
      }
    };

    let match = {
      status: "in progress",
      turn: true,
      winner: false,
      challenger: "",
      challenged: ""
    };
    if (!args[0])
      return message.reply(
        "If you would like to start a game, please run `*tictactoe challenge @username`. For more info, please run `*tictactoe help`."
      );
    switch (
      args[0] // Argument handler
    ) {
      case "h":
      case "help":
        let tttArgs = [];
        addArgumentObjToArray(tttArgs, "Help", "Displays availible Tic Tac Toe Commands.", "h", "help");
        addArgumentObjToArray(
          tttArgs,
          "Challenge",
          "Challenges a user to a game of tic tac toe.",
          "c",
          "challenge <@user>"
        );

        displayHelpEmbed(tttArgs);
        break;
      case "c":
      case "challenge":
        startChallenge();
        break;
    }

    function addArgumentObjToArray(arr, name, desc, short, usage) {
      let argObj = {
        name: name,
        desc: desc,
        short: short,
        usage: `*tictactoe ${usage}`
      }; // Creates an object with all desired arguments

      arr.push(argObj);
    } // Takes an array and a list of attributes. Creates an object
    // with these attributes and adds the object to the array.

    function displayHelpEmbed(tttArgs) {
      // tttArgs should be an array containing objects representing a argument.
      // Each object should have a property for: name, description, shorthand, and usage.

      let embed = new Discord.MessageEmbed()
        .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
        .setTitle("Tic Tac Toe Arguments")
        .setDescription("A list of arguments that can be used with the tic tac toe command.")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.colors.EMBED_COLOR);
      for (x of tttArgs) {
        embed.addField(
          `**${x.name}**`,
          `**Description:** ${x.desc}\n**Shorthand:** ${x.short ? x.short : "none"}\n**Usage:** ${x.usage}`
        );
      }

      message.channel.send(embed);
    } // Creates and sends a embed containing a list of ttt arguments

    function startChallenge() {
      if (!message.mentions.users.first()) {
        res.setDescription("You must specify a user to challenge.");
        message.channel.send(res);
        return;
      } // Checks if a user is metioned, if not, exits statement.

      match.challenger = message.author;
      match.challenged = message.mentions.users.first();

      res.setDescription(
        `${match.challenged}, you have been challenged to a game of Tic Tac Toe by ${match.challenger}.\n\n` +
          `Please type **accept** or **a** to accept the match, and **decline** or **d** to decline the match.\n\n` +
          `This challenge will expire in **30 seconds**.`
      );
      res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      res.setTitle("Tic Tac Toe");
      res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      res.setTimestamp();
      res.setColor(message.client.config.colors.EMBED_COLOR);
      message.channel.send(res);

      let filter = (m) =>
        m.author === match.challenged &&
        ["accept", "a", "decline", "d"].some((c) => c === m.content.toLowerCase());
      // ^ Checks if the message's author is the mentioned user, and if the content is one of the responses.
      let challengeResponse = message.channel.createMessageCollector(filter, { max: 1, time: 30000 });

      challengeResponse.on("collect", (m) => {
        let response = ["accept", "a"].some((c) => c === m.content.toLowerCase()) ? "accept" : "decline";
        // ^ response is equal to 'accept' if the m.content is 'a' or 'accept', otherwise it's equal to 'decline'.
        challengeResponse.stop(response); // Stops the collection with the response variable as the reason.
      });

      challengeResponse.on("end", (col, reason) => {
        switch (
          reason // A reason switch. This is used to determine outcomes of collectors.
        ) {
          case "accept":
            res.setDescription(
              `${match.challenged} has accepted the challenge. The match will begin shortly.`
            );
            res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
            res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
            res.setTimestamp();
            res.setColor(message.client.config.colors.EMBED_COLOR);
            message.channel.send(res);
            startMatch();
            break;
          case "decline":
            res.setDescription(`${match.challenged} has declined the challenge.`);
            res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
            res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
            res.setTimestamp();
            res.setColor(message.client.config.colors.EMBED_COLOR);
            message.channel.send(res);
            break;
          case "time": // The 'time' reason is emmited when the message collecter expires.
            res.setDescription(
              "The challenge has expired. If you still wish to play, please issue another challenge."
            );
            res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
            res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
            res.setTimestamp();
            res.setColor(message.client.config.colors.EMBED_COLOR);
            message.channel.send(res);
            break;
        }
      });
    } // This function starts a challenge which can be accepted or declined.
    // If accepted, runs the 'startMatch()` function.

    function startMatch() {
      // create a quit function or something?
      startTurn();
    } // This function starts the match. It should be run only once, at the start of the match.

    function startTurn() {
      board.print();
      let currentPlayer = match.turn ? match.challenger : match.challenged;
      res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
      res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      res.setTimestamp();
      res.setColor(message.client.config.colors.EMBED_COLOR);
      res.setDescription(
        `${currentPlayer}, it is your turn. Please select a position for your next play.\nExample: A1`
      );
      message.channel.send(res);
      handleTurnResponse(currentPlayer);
    } // This function contains code that should be run at the start of every turn.

    function handleTurnResponse(currentPlayer) {
      let filter = (m) =>
        [match.challenger, match.challenged].some((u) => u === m.author) &&
        ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3", "quit", "exit", "leave"].some(
          (p) => p === m.content.toLowerCase()
        );
      // Filters messages that are sent by the current player and whose content are a position (A1-C3);
      let collector = message.channel.createMessageCollector(filter);
      match.collector = collector;

      collector.on("collect", (m) => {
        // if (m.content.toLowerCase() === "quit") {
        //     collector.stop('quit')
        // } else
        if (["quit", "exit", "leave", "stop"].some((c) => c === m.content.toLowerCase())) {
          // if either player (regardless of whose turn it is) types quit, exit, or leave, stop the match.
          collector.stop("quit");
        } else if (m.author !== currentPlayer) {
          // If it's not the players turn, exit.
          return;
        } else if (board[m.content.toUpperCase()] !== " ") {
          collector.stop("occupied");
        } else {
          board[m.content.toUpperCase()] = match.turn ? "x" : "o";
          // ^ Sets the value of specified turn depending on whose turn it is.
          match.turn = match.turn ? false : true;
          // ^ Toggles value of turn.
          checkBoardCondition(collector);
          collector.stop("turn end");
        }
      });

      collector.on("end", (col, reason) => {
        switch (
          reason // A reason switch for the turn ending.
        ) {
          case "quit":
            res.setDescription("The game has ended by player request.");
            res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
            res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
            res.setTimestamp();
            res.setColor(message.client.config.colors.EMBED_COLOR);
            message.channel.send(res);
            match.status = "finished";
            break;
          case "turn end":
            startTurn();
            break;
          case "occupied":
            res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
            res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
            res.setTimestamp();
            res.setColor(message.client.config.colors.EMBED_COLOR);
            res.setDescription("That position is occupied. Please select an available position.");
            message.channel.send(res);
            startTurn();
            break;
          case "full board":
            board.print();
            res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
            res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
            res.setTimestamp();
            res.setColor(message.client.config.colors.EMBED_COLOR);
            res.setDescription("The board is now full. Ending match.");
            message.channel.send(res);
            match.status = "finished";
            break;
          case "win":
            board.print();
            res.setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp");
            res.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
            res.setTimestamp();
            res.setColor(message.client.config.colors.EMBED_COLOR);
            res.setDescription(`${match.winner} has won the game.`);
            message.channel.send(res);
            match.status = "finished";
            break;
        }
      });
    } // This function handles the turn response. It creates a message collector,
    // and handles the collecting and end condtions.

    function checkBoardCondition(collector) {
      let winConditionPositionList = [
        ["A1", "A2", "A3"],
        ["B1", "B2", "B3"],
        ["C1", "C2", "C3"],
        ["A1", "B1", "C1"],
        ["A2", "B2", "C2"],
        ["A3", "B3", "C3"],
        ["A1", "B2", "C3"],
        ["A3", "B2", "C1"]
      ]; // A list of all rows, columns, and diagonals that can constitute a win if they match.

      for (pos of winConditionPositionList) {
        checkWinCondtionsOfPosisitions(pos);
      }

      function checkWinCondtionsOfPosisitions(positions) {
        // positions should be a array containing three positions which are strings.
        if (
          ["x", "o"].some(
            (c) => c === board[positions[0]] && c === board[positions[1]] && c === board[positions[2]]
          )
        ) {
          match.winner = board[positions[1]] === "x" ? match.challenger : match.challenged;
          collector.stop("win");
        }
      }

      if (!Object.values(board).includes(" ")) {
        collector.stop("full board");
      } // Checks if the board is full.
    } // This function checks things such as win conditions or if the board is full.
  }
};
