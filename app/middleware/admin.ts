export default defineNuxtRouteMiddleware((to, from) => {
    const { user } = useAuth()

    // belum login
    if (!user.value) {
        return navigateTo('/login')
    }

    // login tapi bukan super_admin
    if (user.value.role !== 'super_admin') {
        return navigateTo('/') // atau ke halaman 403
    }
})