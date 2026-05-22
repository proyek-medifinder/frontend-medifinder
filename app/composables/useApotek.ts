export const useApotek = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')
    const photoFile = ref<File | null>(null)

    const normalizeTime = (time?: string | null) => {
        if (!time) return ''
        return String(time).slice(0, 5)
    }

    const getPhotoPath = (data: any) =>
        data?.photo_url ||
        data?.PhotoURL ||
        data?.photoUrl ||
        ''

    const form = useState<any>('apotek_form', () => ({
        nama: '',
        alamat: '',
        deskripsi: '',
        phone_number: '',
        latitude: null,
        longitude: null,
        jam_buka: '',
        jam_tutup: '',
        photo_url: '',
        PhotoURL: ''
    }))

    const loading = ref(false)

    const fetchApotek = async () => {
        const res = await $fetch<any>(
            `${config.public.apiBase}/admin/apotek`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )

        form.value = {
            ...res.data,
            jam_buka: normalizeTime(res.data?.jam_buka),
            jam_tutup: normalizeTime(res.data?.jam_tutup),
            photo_url: getPhotoPath(res.data),
            PhotoURL: getPhotoPath(res.data)
        }
    }



    const uploadPhoto = async () => {
        if (!photoFile.value) return

        const formData = new FormData()
        formData.append('photo', photoFile.value)

        const res: any = await $fetch(`${config.public.apiBase}/admin/foto`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        })

        const uploadedPath = getPhotoPath(res?.data || res)
        if (uploadedPath) {
            form.value.photo_url = uploadedPath
            form.value.PhotoURL = uploadedPath
        }

        return res
    }


    const formatTime = (time: string | null) => {
        if (!time) return null

        // kalau sudah ada detik → biarin
        if (time.length === 8) return time

        // kalau cuma HH:mm → tambahin detik
        if (time.length === 5) return time + ":00"

        return time
    }

    const updateApotek = async () => {
        try {
            loading.value = true

            const payload = {
                nama: form.value.nama,
                alamat: form.value.alamat,
                deskripsi: form.value.deskripsi,
                phone_number: form.value.phone_number,
                latitude: form.value.latitude,
                longitude: form.value.longitude,

                jam_buka: formatTime(form.value.jam_buka),
                jam_tutup: formatTime(form.value.jam_tutup),

                photo_url: getPhotoPath(form.value)
            }
            console.log("📤 KIRIM:", payload)

            await $fetch(`${config.public.apiBase}/admin/apotek`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: payload
            })

        } finally {
            loading.value = false
        }
    }

    return {
        form,
        loading,
        fetchApotek,
        updateApotek,
        photoFile,      // 🔥 WAJIB ADA
        uploadPhoto     // 🔥 WAJIB ADA
    }
}
