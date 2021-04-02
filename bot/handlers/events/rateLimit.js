const chalk = require("chalk");

module.exports = async (client, rateLimitInfo) => {
  console.log(chalk.redBright("[RATE LIMITED]"), `TIMEOUT: ${rateLimitInfo.timeout}`);
  console.log(chalk.redBright("[RATE LIMITED]"), `LIMIT: ${rateLimitInfo.limit}`);
  console.log(chalk.redBright("[RATE LIMITED]"), `METHOD: ${rateLimitInfo.method}`);
  console.log(chalk.redBright("[RATE LIMITED]"), `PATH: ${rateLimitInfo.path}`);
  console.log(chalk.redBright("[RATE LIMITED]"), `ROUTE: ${rateLimitInfo.route}`);
};
