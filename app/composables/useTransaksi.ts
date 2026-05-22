export const useTransaksi = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const transaksi = useState<any[]>('transaksi_data', () => [])
    const loading = ref(false)
    const totalPage = ref(1)
    const error = ref('')

    const fetchTransaksi = async (params?: {
        status?: string
        page?: number
        limit?: number
    }) => {
        try {
            loading.value = true
            error.value = ''

            const query = new URLSearchParams()

            if (params?.status) query.append('status', params.status)
            if (params?.page) query.append('page', String(params.page))
            if (params?.limit) query.append('limit', String(params.limit))

            const res: any = await $fetch(
                `${config.public.apiBase}/superadmin/transaksi?${query.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            )

            transaksi.value = res.data || []
            totalPage.value = res.meta?.total_page || 1
        } catch (err: any) {
            console.error('Transaksi error:', err)
            transaksi.value = []
            totalPage.value = 1
            error.value = err?.data?.message || err?.message || 'Transaksi belum bisa dimuat.'
        } finally {
            loading.value = false
        }
    }

    const getDetail = async (id: string) => {
        return await $fetch(
            `${config.public.apiBase}/superadmin/transaksi/${id}`,
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
        totalPage,
        error,
        fetchTransaksi,
        getDetail
    }
}
