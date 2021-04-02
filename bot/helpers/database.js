const mongoose = require("mongoose");
const Levels = require("discord-xp");

module.exports = (client) => {
  if (!client.config.tokens.MONGODB_URL) {
    return console.error("There is not a MongoDB URL provided, this is required for the bot to work.");
  }

  Levels.setURL(client.config.tokens.MONGODB_URL);

  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4
  };

  mongoose.connect(client.config.tokens.MONGODB_URL, dbOptions);

  mongoose.set("useFindAndModify", false);

  mongoose.Promise = global.Promise;
};
