export const useKontakAdmin = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const pesan = ref<any[]>([])
    const loading = ref(false)

    const fetchPesan = async () => {
        try {
            loading.value = true

            const res: any = await $fetch(
                `${config.public.apiBase}/superadmin/kontak`,
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            )

            // 🔥 sesuaikan response
            pesan.value = res.data || res || []

        } finally {
            loading.value = false
        }
    }

    const detail = ref<any>(null)

    const fetchDetail = async (id: string) => {
        const res: any = await $fetch(
            `${config.public.apiBase}/superadmin/kontak/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )

        detail.value = res.data || res
    }

    const updateStatus = async (id: string, status: string) => {
        await $fetch(
            `${config.public.apiBase}/superadmin/kontak/${id}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: { status }
            }
        )
    }

    return {
        pesan,
        loading,
        fetchPesan,
        fetchDetail,
        detail,
        updateStatus
    }
}