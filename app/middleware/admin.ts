export default defineNuxtRouteMiddleware(async (to, from) => {
    const { ensureUser, user } = useAuth()

    await ensureUser()

    if (!user.value) {
        return navigateTo('/login') 
    }
})