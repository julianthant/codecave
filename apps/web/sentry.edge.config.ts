// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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
