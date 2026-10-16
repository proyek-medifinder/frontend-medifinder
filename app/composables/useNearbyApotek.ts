export const useNearbyApotek = () => {
    const config = useRuntimeConfig()

    const apoteks = ref<any[]>([])
    const loading = ref(false)
    const error = ref('')
    let requestId = 0

    const getLocation = () => {
        return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    })
                },
                (err) => reject(err)
            )
        })
    }

    const fetchNearby = async (lat: number, lng: number) => {
        const currentRequest = ++requestId
        try {
            loading.value = true
            error.value = ''
            apoteks.value = []

            const results: any[] = []
            let page = 1
            let totalPages = 1
            do {
                const res: any = await $fetch(
                    `${config.public.apiBase}/apotek/nearby`,
                    {
                        params: { lat, lng, radius: 5, page, limit: 50 },
                        headers: {
                            'ngrok-skip-browser-warning': 'true'
                        }
                    }
                )

                if (currentRequest !== requestId) return
                results.push(...(res.data || []))
                totalPages = res.meta?.total_page ?? 1
                page++
            } while (page <= totalPages)

            apoteks.value = results
        } catch (err) {
            if (currentRequest !== requestId) return
            error.value = 'Data apotek belum dapat dimuat. Silakan coba lagi.'
            console.error("❌ Gagal fetch nearby:", err)
        } finally {
            if (currentRequest === requestId) loading.value = false
        }
    }

    const initNearby = async (lat?: number, lng?: number) => {
        let coords

        if (lat !== undefined && lng !== undefined) {
            coords = { lat, lng }
        } else {
            coords = await getLocation()
        }

        await fetchNearby(coords.lat, coords.lng)

        return coords
    }

    return {
        apoteks,
        loading,
        error,
        initNearby
    }
}
