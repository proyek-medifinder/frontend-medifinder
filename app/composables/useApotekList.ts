export const useApotekList = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token') // 🔥 WAJIB

    const apoteks = ref<any[]>([])
    const loading = ref(false)

    const getPhotoPath = (item: any) =>
        item?.photo_url ||
        item?.PhotoURL ||
        item?.photoUrl ||
        item?.secure_url ||
        item?.cloudinary_url ||
        item?.cloudinaryUrl ||
        item?.image_url ||
        item?.imageUrl ||
        item?.foto_url ||
        item?.fotoUrl ||
        ''

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

            apoteks.value = (res.data || []).map((item: any) => ({
                ...item,
                photo_url: getPhotoPath(item),
                PhotoURL: getPhotoPath(item)
            }))

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
