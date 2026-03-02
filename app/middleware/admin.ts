// export default defineNuxtRouteMiddleware(() => {
//     const user = useState<any>('auth_user')

//     if (!user.value) {
//         return navigateTo('/login')
//     }

//     if (user.value.role !== 'super_admin') {
//         return navigateTo('/')
//     }
// })

export default defineNuxtRouteMiddleware(() => {
    const token = useCookie<string | null>('auth_token')
    const user = useState<any>('auth_user')

    // Tidak ada token = pasti belum login
    if (!token.value) {
        return navigateTo('/login')
    }

    // Kalau user belum ter-restore tapi token ada, biarkan dulu
    if (!user.value) {
        return
    }

    // Cek role saja
    if (user.value.role !== 'super_admin') {
        return navigateTo('/')
    }
})