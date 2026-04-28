export const useAdminTransaksi = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const transaksi = ref<any[]>([])
    const loading = ref(false)
    const totalPage = ref(1)

    const fetchTransaksi = async (status = '', page = 1) => {
        try {
            loading.value = true

            const res: any = await $fetch(
                `${config.public.apiBase}/admin/transaksi`,
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    },
                    query: {
                        status,
                        page,
                        limit: 5
                    }
                }
            )

            transaksi.value = res.data || []
            totalPage.value = res.meta?.total_page || 1 // 🔥 sekarang aman

        } finally {
            loading.value = false
        }
    }

 

    return {
        transaksi,
        loading,
        fetchTransaksi,
        totalPage
    }
}