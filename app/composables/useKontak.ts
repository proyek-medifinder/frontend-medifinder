// composables/useKontak.ts
export const useKontak = () => {
    const config = useRuntimeConfig()

    const loading = ref(false)
    const success = ref(false)
    const error = ref<string | null>(null)

    const sendPesan = async (payload: {
        nama: string
        email: string
        subjek: string
        pesan: string
    }) => {
        try {
            loading.value = true
            success.value = false
            error.value = null

            await $fetch(`${config.public.apiBase}/kontak`, {
                method: 'POST',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                body: payload
            })

            success.value = true

        } catch (err: any) {
            error.value = err?.data?.message || 'Gagal kirim pesan'
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        success,
        error,
        sendPesan
    }
}