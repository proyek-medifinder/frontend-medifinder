export const useObatApotek = () => {
    const config = useRuntimeConfig()

    const data = ref<any[]>([])
    const loading = ref(false)

    const fetchObat = async (id: string, keyword?: string) => {
        const params: any = {}

        if (keyword && keyword.trim() !== '') {
            params.name = keyword
        }

        const res: any = await $fetch(
            `${config.public.apiBase}/apotek/${id}/obat`,
            {
                params,
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )

        data.value = res.data || []
    }

    return {
        data,
        loading,
        fetchObat
    }
}