"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = require("@sentry/nestjs");
Sentry.init({
    dsn: "https://11a6f737895ac57bcf3fbbfe207b4827@o4509683568148480.ingest.us.sentry.io/4509683571818496",
    sendDefaultPii: true,
    _experiments: {
        enableLogs: true,
    },
    integrations: [
        Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
    ],
});
//# sourceMappingURL=instrument.js.map