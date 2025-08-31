// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    ssr: false,

    modules: [
        '@nuxt/content',
        '@nuxt/eslint',
        '@nuxt/fonts',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/test-utils',
        '@nuxt/ui-pro'
    ],

    css: [
        '~/assets/css/main.css',
    ],

    future: {
        compatibilityVersion: 4
    },

    runtimeConfig: {
        public: {
            api: process.env.services__api__https__0 || process.env.services__api__http__0 || 'https://localhost:7059'
        }
    }
})