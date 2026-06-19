export const DashboardConfig = {
  environment: {
    /**
     * Returns boolean depending on the mode the app is running in (true for 'development').
     * Taken from NODE_ENV env variable.
     */
    isDev: process.env.NODE_ENV == "development",

    /**
     * Returns boolean depending on the environment the property was read in.
     * True if inside server (SSR), otherwise on client (CSR)
     */
    get isServerSide() {
      return typeof window == "undefined";
    },

    /**
     * Returns boolean depending on the environment the property was read in.
     * False if inside server (SSR), otherwise on client (CSR)
     */
    get isClientSide() {
      return typeof window != "undefined";
    },
  },

  addresses: {
    /**
     * Base url of the orchestrator server. Taken from env depending on SSR/CSR.
     * Internal docker address for SSR, public address for CSR
     */
    get orchestratorBaseUrl() {
      return DashboardConfig.environment.isClientSide
        ? process.env.NEXT_PUBLIC_ORCHESTRATOR_URL
        : process.env.ORCHESTRATOR_URL_SERVER_SIDE;
    },
  },
};
