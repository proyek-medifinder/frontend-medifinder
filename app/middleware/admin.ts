export default defineNuxtRouteMiddleware(async () => {
    const token = useCookie<string | null>('auth_token')
    const { user, ensureUser } = useAuth()

    if (!token.value) {
        return navigateTo('/login')
    }

    await ensureUser()

    if (user.value?.role !== 'super_admin') {
        return navigateTo('/')
    }
})