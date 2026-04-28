export const useArtikel = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const artikels = ref<any[]>([])
    const loading = ref(false)

    const page = ref(1)
    const totalPage = ref(1)

    /* =========================
       GET LIST ARTIKEL
    ========================= */
    const fetchArtikel = async (pageNum = 1) => {
        try {
            loading.value = true

            const res: any = await $fetch(
                `${config.public.apiBase}/artikel`,

                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    },
                }
            )

            artikels.value = res.data || []

        } finally {
            loading.value = false
        }
    }

    /* =========================
       CREATE ARTIKEL
    ========================= */
    const createArtikel = async (data: {
        judul: string
        konten: string
        kategori: string
        status: string
        thumbnail?: File | null
    }) => {

        const formData = new FormData()
        formData.append('judul', data.judul)
        formData.append('konten', data.konten)
        formData.append('kategori', data.kategori)
        formData.append('status', data.status)

        if (data.thumbnail) {
            formData.append('thumbnail', data.thumbnail)
        }

        return await $fetch(`${config.public.apiBase}/superadmin/artikel`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        })
    }

    /* =========================
       FETCH NEWS API
    ========================= */
    const fetchFromNews = async () => {
        return await $fetch(`${config.public.apiBase}/superadmin/artikel/fetch`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            }
        })
    }

    /* =========================
       DELETE
    ========================= */
    const deleteArtikel = async (id: string) => {
        return await $fetch(
            `${config.public.apiBase}/superadmin/artikel/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )
    }

    const updateArtikel = async (
        id: string,
        data: {
            judul: string
            konten: string
            kategori: string
            status: string
            thumbnail?: File | null
        }
    ) => {
        const formData = new FormData()
        formData.append('judul', data.judul)
        formData.append('konten', data.konten)
        formData.append('kategori', data.kategori)
        formData.append('status', data.status)

        if (data.thumbnail) {
            formData.append('thumbnail', data.thumbnail)
        }

        return await $fetch(`${config.public.apiBase}/superadmin/artikel/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        })
    }

    return {
        artikels,
        loading,
        page,
        totalPage,
        fetchArtikel,
        createArtikel,
        updateArtikel,
        deleteArtikel,
        fetchFromNews
    }
}
