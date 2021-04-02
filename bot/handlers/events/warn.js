const chalk = require("chalk");

module.exports = async (client, info) => {
  console.log(chalk.magenta("[Warning]"), info);
  client.utils.sentry.captureException(error);
};
