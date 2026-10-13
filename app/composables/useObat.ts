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
                id: item.id || item.ID,
                nama: item.nama || item.Nama,
                deskripsi: item.deskripsi || item.Deskripsi || '',
                stok: item.stok ?? item.Stok ?? 0,
                harga: item.harga ?? item.Harga ?? 0,
                image_url: item.image_url || item.ImageURL || ''
            }))
        } catch (err) {
            console.error("Gagal ambil obat", err)
        } finally {
            loading.value = false
        }
    }

    // 🔥 CREATE (bisa kirim JSON atau FormData berisi file image)
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

    // 🔥 UPDATE (bisa kirim JSON atau FormData)
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

    // 🔥 UPLOAD FOTO KE CLOUDINARY
    const uploadObatFoto = async (id: string, file: File) => {
        const formData = new FormData()
        formData.append('image', file)

        const res = await $fetch<any>(`${config.public.apiBase}/admin/obat/${id}/foto`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token.value}`
            },
            body: formData
        })

        fetchObat()
        return res
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
        uploadObatFoto,
        deleteObat
    }
}