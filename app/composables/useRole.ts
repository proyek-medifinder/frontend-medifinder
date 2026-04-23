export const useRole = () => {
    const { user } = useAuth()

    const isSuperAdmin = computed(() => {
        return user.value?.role === 'super_admin'
    })

    const isAdminApotek = computed(() => {
        return user.value?.role === 'admin_apotek'
    })

    return {
        isSuperAdmin,
        isAdminApotek
    }
}