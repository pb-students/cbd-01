import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@hebilicious/authjs-nuxt',
    '@vueuse/nuxt'
  ],

  // Auth
  alias: { cookie: resolve(__dirname, 'node_modules/cookie') },
  runtimeConfig: {
    authJs: { secret: '+U9t4zM9A10FJhJvO0tBGNeSqA/KG8Ap5P93rzkWqhc=' },
    public: {
      authJs: {
        verifyClientOnEveryRequest: true,
        baseUrl: process.env.NUXT_NEXTAUTH_URL
      }
    }
  }
})

