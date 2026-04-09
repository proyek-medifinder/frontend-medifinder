export default defineNuxtRouteMiddleware((to) => {
    const user = useState<any>('auth_user', () => null)

    // halaman login bebas
    if (to.path === '/') return

    if (!user.value) {
        return navigateTo('/')
    }
})