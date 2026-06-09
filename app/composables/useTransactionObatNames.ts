type TransactionItemLike = {
    obat_id?: string | number | null
    ObatID?: string | number | null
    obatId?: string | number | null
    id_obat?: string | number | null
    [key: string]: any
}

const normalizeKey = (value: unknown) => String(value ?? '').trim()

const extractObatId = (item: TransactionItemLike) =>
    normalizeKey(item?.obat_id ?? item?.ObatID ?? item?.obatId ?? item?.id_obat ?? item?.obat_id)

const extractObatName = (item: any) =>
    String(
        item?.Nama ??
        item?.nama ??
        item?.name ??
        item?.obat_nama ??
        item?.obatName ??
        '-'
    )

export const useTransactionObatNames = () => {
    const config = useRuntimeConfig()
    const cache = useState<Record<string, Record<string, string>>>(
        'transaction_obat_name_cache',
        () => ({})
    )

    const resolveMap = async (apotekId?: string | number | null) => {
        const key = normalizeKey(apotekId)
        if (!key) return {}

        if (cache.value[key]) return cache.value[key]

        const res: any = await $fetch(`${config.public.apiBase}/apotek/${key}/obat`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        })

        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
        const map: Record<string, string> = {}

        for (const item of list) {
            const id = normalizeKey(
                item?.ID ?? item?.id ?? item?.obat_id ?? item?.obatId ?? item?.uuid
            )
            const name = extractObatName(item)

            if (id) map[id] = name
        }

        cache.value[key] = map
        return map
    }

    const resolveObatName = async (apotekId?: string | number | null, obatId?: string | number | null) => {
        const map = await resolveMap(apotekId)
        const key = normalizeKey(obatId)
        return map[key] || '-'
    }

    const enrichItems = async (apotekId?: string | number | null, items: TransactionItemLike[] = []) => {
        const map = await resolveMap(apotekId)

        return items.map((item) => {
            const obatId = extractObatId(item)
            return {
                ...item,
                obat_nama: map[obatId] || item?.obat_nama || '-'
            }
        })
    }

    const summarizeItems = async (apotekId?: string | number | null, items: TransactionItemLike[] = []) => {
        const enriched = await enrichItems(apotekId, items)
        const names = enriched
            .map((item: any) => String(item?.obat_nama || '').trim())
            .filter(Boolean)

        const unique = Array.from(new Set(names))
        return unique.length ? unique.join(', ') : '-'
    }

    return {
        resolveMap,
        resolveObatName,
        enrichItems,
        summarizeItems
    }
}
