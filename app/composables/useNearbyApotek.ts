export const useNearbyApotek = () => {
    const config = useRuntimeConfig()

    const apoteks = ref<any[]>([])
    const loading = ref(false)

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
        try {
            loading.value = true

            const res: any = await $fetch(
                `${config.public.apiBase}/apotek/nearby`,
                {
                    params: { lat, lng },
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            )

            apoteks.value = res.data || []
        } catch (err) {
            console.error("❌ Gagal fetch nearby:", err)
        } finally {
            loading.value = false
        }
    }

    const initNearby = async (lat?: number, lng?: number) => {
        let coords

        if (lat && lng) {
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
        initNearby
    }
}