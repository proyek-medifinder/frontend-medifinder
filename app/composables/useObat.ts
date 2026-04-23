export const useObat = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const medicines = ref<any[]>([])
    const loading = ref(false)

    // 🔥 GET DATA OBAT
    const fetchObat = async () => {
        try {
            loading.value = true

            const res = await $fetch<any>(
                `${config.public.apiBase}/admin/obat`,
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            )

            console.log("DATA OBAT:", res)

            medicines.value = (res.data || []).map((item: any) => ({
                id: item.ID,
                nama: item.Nama,
                stok: item.Stok,
                harga: item.Harga
            }))
        } catch (err) {
            console.error("Gagal ambil obat", err)
        } finally {
            loading.value = false
        }
    }

    // 🔥 CREATE
    const createObat = async (payload: any) => {
        await $fetch(`${config.public.apiBase}/admin/obat`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.value}`
            },
            body: payload
        })

        fetchObat()
    }

    // 🔥 UPDATE
    const updateObat = async (id: string, payload: any) => {
        await $fetch(`${config.public.apiBase}/admin/obat/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token.value}`
            },
            body: payload
        })

        fetchObat()
    }

    // 🔥 DELETE
    const deleteObat = async (id: string) => {
        await $fetch(`${config.public.apiBase}/admin/obat/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })

        fetchObat()
    }

    return {
        medicines,
        loading,
        fetchObat,
        createObat,
        updateObat,
        deleteObat
    }
}