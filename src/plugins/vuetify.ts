import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { MAIN_THEME, mainTheme, mainDarkTheme } from '@/helpers/themes'
import { defaults } from '@/helpers/defaults'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '~/assets/scss/variables.scss'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    components: { ...components, VNumberInput },
    directives,
    defaults,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme,
        mainDarkTheme,
      },
      variations: {
        colors: ['primary', 'secondary', 'accent'],
        lighten: 9,
        darken: 9,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
