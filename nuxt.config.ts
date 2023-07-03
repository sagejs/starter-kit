// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  routeRules: {
    '/': {
      prerender: true,
    },
  },
  runtimeConfig: {
    public: {
      // Nuxt generates wrong type for booleans but they work
      enableStorage: false,
      enableSgid: false,
      appName: '@sagejs/starter-kit',
    },

    skipEnvValidation: false,
    databaseUrl: '',
    otpExpiry: 600,

    postmanApiKey: '',
    sessionSecret: '',

    r2: {
      accessKeyId: '',
      accountId: '',
      secretAccessKey: '',
      publicHostname: '',
      avatarsBucketName: '',
    },

    sgid: {
      clientId: '',
      clientSecret: '',
      privateKey: '',
      redirectUri: '',
    },

    sendgrid: {
      apiKey: '',
      fromAddress: '',
    },
  },
})
