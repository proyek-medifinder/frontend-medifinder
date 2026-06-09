export const useUserTransaksi = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const transaksi = ref<any[]>([])
    const loading = ref(false)
    const error = ref('')

    const normalizeListResponse = (response: any) => {
        if (Array.isArray(response?.data)) return response.data
        if (Array.isArray(response?.data?.data)) return response.data.data
        if (Array.isArray(response)) return response
        return []
    }

    const fetchTransaksi = async () => {
        if (!token.value) {
            transaksi.value = []
            return
        }

        try {
            loading.value = true
            error.value = ''

            const res: any = await $fetch(`${config.public.apiBase}/transaksi`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            transaksi.value = normalizeListResponse(res)
        } catch (err: any) {
            console.error('Gagal ambil transaksi user', err)
            transaksi.value = []
            error.value = err?.data?.message || err?.message || 'Riwayat transaksi belum bisa dimuat.'
        } finally {
            loading.value = false
        }
    }

    const getDetail = async (id: string) => {
        return await $fetch(`${config.public.apiBase}/transaksi/${id}`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            }
        })
    }

    return {
        transaksi,
        loading,
        error,
        fetchTransaksi,
        getDetail
    }
}
