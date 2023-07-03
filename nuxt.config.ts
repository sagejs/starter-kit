/* eslint-disable no-console */

import { validateBuildEnv } from './utils/env'

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
      enableStorage: process.env.NUXT_PUBLIC_ENABLE_STORAGE || false,
      enableSgid: process.env.NUXT_PUBLIC_ENABLE_SGID || false,
      appName: process.env.NUXT_PUBLIC_APP_NAME || '@sagejs/starter-kit',
    },

    databaseUrl: process.env.DATABASE_URL || '',
    otpExpiry: process.env.OTP_EXPIRY || '',

    postmanApiKey: process.env.POSTMAN_API_KEY || '',
    sessionSecret: process.env.SESSION_SECRET || '',

    r2: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      accountId: process.env.R2_ACCOUNT_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      publicHostname: process.env.R2_PUBLIC_HOSTNAME || '',
      avatarsBucketName: process.env.R2_AVATARS_BUCKET_NAME || '',
    },

    sgid: {
      clientId: process.env.SGID_CLIENT_ID || '',
      clientSecret: process.env.SGID_CLIENT_SECRET || '',
      privateKey: process.env.SGID_PRIVATE_KEY || '',
      redirectUri: process.env.SGID_REDIRECT_URI || '',
    },

    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromAddress: process.env.SENDGRID_FROM_ADDRESS || '',
    },
  },
  hooks: {
    'build:before': () => {
      if (process.env.SKIP_ENV_VALIDATION) {
        console.info('[nuxt build:before] Skipping build env validation')
        return
      }

      console.info('[nuxt build:before] Running build env validation')

      try {
        validateBuildEnv()
      }
      catch (err: any) {
        console.error('[nuxt build:before] Build env validation failed: ', JSON.stringify(err.cause, null, '\t'))
        throw err
      }
    },
  },
})
