"use strict";

/**
 * New Relic agent configuration for CodeCave API
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ["CodeCave API"],

  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  /**
   * Logging level. 'trace' is most useful to New Relic when diagnosing
   * issues with the agent, 'info' and higher will impose the least overhead on
   * production applications.
   */
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when
     * diagnosing issues with the agent, 'info' and higher will impose the
     * least overhead on production applications.
     */
    level: process.env.NODE_ENV === "production" ? "info" : "trace",
  },

  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,

  /**
   * Attributes captured and sent with every event.
   */
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations.
     */
    exclude: [
      "request.headers.cookie",
      "request.headers.authorization",
      "request.headers.proxyAuthorization",
      "request.headers.setCookie*",
      "request.headers.x*",
      "response.headers.cookie",
      "response.headers.authorization",
      "response.headers.proxyAuthorization",
      "response.headers.setCookie*",
    ],
  },

  /**
   * Configuration for database monitoring.
   */
  database_name_reporting: {
    enabled: true,
  },

  /**
   * Configuration for distributed tracing.
   */
  distributed_tracing: {
    /**
     * Enables/disables distributed tracing.
     */
    enabled: true,
  },

  /**
   * Configuration for application logging features.
   */
  application_logging: {
    enabled: true,
    forwarding: {
      enabled: true,
      max_samples_stored: 10000,
    },
    metrics: {
      enabled: true,
    },
    local_decorating: {
      enabled: true,
    },
  },
};
