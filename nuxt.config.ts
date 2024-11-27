// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devServer: {
    https: {
      key: './.ssl/localhost-key.pem',
      cert: './.ssl/localhost.pem',
    },
  },
  ssr: false,
  srcDir: './src',
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  build: {
    transpile: ['vuetify'],
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins!.push(vuetify())
    },
  },
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern"
        },
      },
    },
  },
  modules: ['@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/google-fonts', '@pinia-plugin-persistedstate/nuxt'],
  googleFonts: {
    families: {
      'IBM+Plex+Sans+Thai': true,
    },
    display: 'swap',
    download: true,
    preload: true,
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
})
