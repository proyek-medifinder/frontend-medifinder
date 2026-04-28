export const useAdminApotek = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    /* =========================
       UPDATE ADMIN
    ========================= */
    const updateStatusAdmin = async (id: string, status: 'approved' | 'suspended') => {
        return await $fetch(
            `${config.public.apiBase}/superadmin/admin/${id}/status`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: {
                    status
                }
            }
        )
    }

    /* =========================
       DELETE ADMIN
    ========================= */
    const deleteAdmin = async (id: string) => {
        return await $fetch(
            `${config.public.apiBase}/superadmin/admin/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )
    }

    return {
        updateStatusAdmin,
        deleteAdmin
    }
}