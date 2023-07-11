// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
  ],
  typescript: {
    strict: true,
  },
  css: [
    '@unocss/reset/tailwind-compat.css',
    'primevue/resources/primevue.min.css',
    'primevue/resources/themes/mdc-light-deeppurple/theme.css',
    '~/styles/global.css',
  ],
  build: {
    transpile: [
      'primevue',
      'trpc-nuxt',
    ],
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
    sessionName: 'h3',

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

    resend: {
      apiKey: '',
      fromAddress: '',
    },
  },
})
