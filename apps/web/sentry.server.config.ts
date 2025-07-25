// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isDevelopment = process.env.NODE_ENV === "development";

Sentry.init({
  dsn: "https://b58a3f33eca1869cd4cc0a2b79dd589f@o4509683568148480.ingest.us.sentry.io/4509683569262592",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: isDevelopment ? 0 : 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Only send events in production or when auth token is available
  beforeSend: (event) => {
    if (isDevelopment || !process.env.SENTRY_AUTH_TOKEN) {
      return null;
    }
    return event;
  },
});
