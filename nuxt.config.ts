// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/a11y', '@nuxt/image', '@nuxt/ui'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
    storageKey: 'medifinder_theme'
  },

  fonts: {
    families: [
      {
        name: 'Poppins',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
        styles: ['normal'],
      }
    ]
  },

  app: {
    head: {
      titleTemplate: "%s - MediFinder",
      title: "MediFinder"
    }
  },

  // runtimeConfig: {
  //   public: {
  //     apiBase: 'http://localhost:8000'
  //   }
  // }
  runtimeConfig: {
    public: {
      apiBase: 'https://medifinder-backend-production.up.railway.app'
    }
  }
})