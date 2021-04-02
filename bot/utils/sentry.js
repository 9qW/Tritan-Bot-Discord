module.exports = (client) => {
  client.utils.sentry = require("@sentry/node");
  client.utils.tracing = require("@sentry/tracing");

if (client.config.tokens.SENTRY_DSN) {
  client.utils.sentry.init({
    dsn: client.config.tokens.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
    debug: true,
    environment: "production"
  });
}
};
