

export default defineNuxtRouteMiddleware((to, from) => {
    if (to.name === 'dashboard' && !to.params.channel)
        return {path: "/"}
})
