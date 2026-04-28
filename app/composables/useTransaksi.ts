export const useTransaksi = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const transaksi = useState<any[]>('transaksi_data', () => [])
    const loading = ref(false)

    const fetchTransaksi = async (params?: {
        status?: string
        page?: number
        limit?: number
    }) => {
        try {
            loading.value = true

            const query = new URLSearchParams()

            if (params?.status) query.append('status', params.status)
            if (params?.page) query.append('page', String(params.page))
            if (params?.limit) query.append('limit', String(params.limit))

            const res: any = await $fetch(
                `${config.public.apiBase}/transaksi?${query.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            )

            transaksi.value = res.data || []

        } catch (err) {
            console.error("❌ transaksi:", err)
        } finally {
            loading.value = false
        }
    }

    const getDetail = async (id: string) => {
        return await $fetch(
            `${config.public.apiBase}/transaksi/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )
    }

    return {
        transaksi,
        loading,
        fetchTransaksi,
        getDetail
    }
}