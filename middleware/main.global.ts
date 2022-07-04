export default defineNuxtRouteMiddleware((to) => {
  if (to.name === 'dashboard' && !to.params.channel)
    return { path: '/' }
})
