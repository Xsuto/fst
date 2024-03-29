// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    'nuxt-icon',
  ],
  ssr: false,
  experimental: {
    reactivityTransform: true,
  },
})
