export const useApotekList = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token') // 🔥 WAJIB

    const apoteks = ref<any[]>([])
    const loading = ref(false)

    const fetchApotek = async () => {
        try {
            loading.value = true

            const res: any = await $fetch(
                `${config.public.apiBase}/superadmin/apotek`,
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`, // 🔥 INI YANG KURANG
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            )

            console.log("📦 APOTEK:", res)

            apoteks.value = res.data || []

        } catch (err) {
            console.error("❌ gagal ambil apotek", err)
        } finally {
            loading.value = false
        }
    }

    return {
        apoteks,
        loading,
        fetchApotek
    }
}