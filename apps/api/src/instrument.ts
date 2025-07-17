// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs";

Sentry.init({
  dsn: "https://11a6f737895ac57bcf3fbbfe207b4827@o4509683568148480.ingest.us.sentry.io/4509683571818496",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,

  // Enable logging as specified in cursor rules
  _experiments: {
    enableLogs: true,
  },

  // Add console logging integration
  integrations: [
    // send console.log, console.error, and console.warn calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
  ],
}); 