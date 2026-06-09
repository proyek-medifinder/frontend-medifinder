<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({
    title: 'Pesanan Obat'
})

const statusFilter = ref('')
const page = ref(1)

const showDetailModal = ref(false)
const detailLoading = ref(false)
const selectedTransaction = ref<any | null>(null)
const selectedTransactionItems = ref<any[]>([])
const transactionObatSummaryMap = ref<Record<string, string>>({})

const { transaksi, fetchTransaksi, loading, totalPage, getDetail } = useAdminTransaksi()
const { enrichItems, summarizeItems } = useTransactionObatNames()

const formatCurrency = (value: number | string | null | undefined) =>
    new Intl.NumberFormat('id-ID').format(Number(value || 0))

const formatDateTime = (value?: string | null) => {
    if (!value) return '-'
    return new Date(value).toLocaleString('id-ID')
}

const statusClass = (status?: string) => {
    const normalized = String(status || '').toLowerCase()
    if (normalized === 'pending') return 'bg-yellow-50 text-yellow-700'
    if (normalized === 'paid') return 'bg-green-50 text-green-700'
    if (normalized === 'failed') return 'bg-red-50 text-red-700'
    return 'bg-slate-100 text-slate-700'
}

const getOrderObatSummary = (order: any) =>
    transactionObatSummaryMap.value[order?.id] || order?.obat_nama || '-'

const enrichTransactionHistory = async () => {
    transactionObatSummaryMap.value = {}

    await Promise.all(transaksi.value.map(async (order: any) => {
        try {
            const res: any = await getDetail(order.id)
            const detailItems = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
            await enrichItems(order.apotek_id, detailItems)
            transactionObatSummaryMap.value[order.id] = await summarizeItems(order.apotek_id, detailItems)
        } catch {
            transactionObatSummaryMap.value[order.id] = '-'
        }
    }))
}

const loadData = async () => {
    await fetchTransaksi(statusFilter.value, page.value)
    await enrichTransactionHistory()
}

const openDetail = async (order: any) => {
    try {
        detailLoading.value = true
        showDetailModal.value = true
        selectedTransaction.value = order

        const res: any = await getDetail(order.id)
        const detailItems = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
        selectedTransactionItems.value = await enrichItems(order.apotek_id, detailItems)
    } catch (err) {
        console.error('Gagal ambil detail transaksi admin apotek', err)
        selectedTransaction.value = null
        selectedTransactionItems.value = []
    } finally {
        detailLoading.value = false
    }
}

const closeDetail = () => {
    showDetailModal.value = false
    selectedTransaction.value = null
    selectedTransactionItems.value = []
}

const totalPesanan = computed(() => transaksi.value.length)

const totalPaid = computed(() =>
    transaksi.value.filter(t => t.status === 'paid').length
)

const totalPending = computed(() =>
    transaksi.value.filter(t => t.status === 'pending').length
)

watch(statusFilter, async () => {
    page.value = 1
    await loadData()
})

onMounted(loadData)
</script>

<template>
    <AppLoadingOverlay v-if="loading" label="Memuat pesanan obat..." description="Daftar pesanan sedang diambil dari API." />

    <div class="space-y-6">
        <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
            <div class="w-full max-w-3xl rounded-[32px] bg-white p-6 shadow-2xl">
                <div class="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600/70">
                            Detail Transaksi
                        </p>
                        <h2 class="mt-2 text-2xl font-semibold text-slate-900">
                            {{ selectedTransaction?.id || 'Transaksi' }}
                        </h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Ringkasan transaksi lengkap dari API.
                        </p>
                    </div>

                    <button @click="closeDetail" class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200">
                        Tutup
                    </button>
                </div>

                <div v-if="detailLoading" class="mt-6 text-sm text-slate-500">
                    Memuat detail transaksi...
                </div>

                <div v-else-if="selectedTransaction" class="mt-6 space-y-4 text-sm text-slate-700">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">ID Transaksi</p>
                            <p class="mt-2 break-all font-semibold text-slate-900">{{ selectedTransaction.id }}</p>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Status</p>
                            <span class="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(selectedTransaction.status)">
                                {{ selectedTransaction.status || '-' }}
                            </span>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Total</p>
                            <p class="mt-2 font-semibold text-slate-900">{{ formatCurrency(selectedTransaction.total_harga ?? selectedTransaction.total) }}</p>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dibuat</p>
                            <p class="mt-2 font-semibold text-slate-900">{{ formatDateTime(selectedTransaction.created_at) }}</p>
                        </div>
                    </div>

                    <div class="pt-2">
                        <p class="mb-2 font-semibold text-slate-900">Item Transaksi</p>

                        <div v-if="selectedTransactionItems.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                            Detail item transaksi tidak tersedia.
                        </div>

                        <div v-else class="space-y-3">
                            <div v-for="item in selectedTransactionItems" :key="item.id" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                                <p><b>Detail ID:</b> {{ item.id }}</p>
                                <p><b>Transaksi ID:</b> {{ item.transaksi_id || '-' }}</p>
                                <p><b>Obat:</b> {{ item.obat_nama || '-' }}</p>
                                <p><b>Obat ID:</b> {{ item.obat_id || '-' }}</p>
                                <p><b>Jumlah:</b> {{ item.jumlah ?? 0 }}</p>
                                <p><b>Harga:</b> Rp {{ formatCurrency(item.harga) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="grid gap-5 md:grid-cols-3">
            <AdminMetricCard title="Pesanan Masuk" icon="solar:bag-smile-bold-duotone" badge="Hari ini"
                description="Antrean sejak pagi" :value="totalPesanan" />
            <AdminMetricCard title="Siap Dikirim" :value="totalPaid" icon="solar:delivery-bold-duotone"
                badge="Siap diproses" description="Butuh pickup atau kurir" icon-class="bg-cyan-50 text-cyan-700"
                badge-class="bg-cyan-50 text-cyan-700" />
            <AdminMetricCard title="Tertahan" :value="totalPending" icon="solar:document-add-bold-duotone"
                badge="Perlu verifikasi" description="Terkait resep atau pembayaran"
                icon-class="bg-rose-50 text-rose-700" badge-class="bg-rose-50 text-rose-700" />
        </section>

        <section class="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div>
                <h3 class="text-lg font-semibold text-slate-900">
                    Daftar Pesanan Obat
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                    Fokus utama admin apotek ada di sini: mana pesanan yang harus diproses, diverifikasi, atau dikirim lebih dulu.
                </p>
            </div>

            <div class="mt-5 space-y-4">
                <div class="flex gap-2 mb-4">
                    <button @click="statusFilter = ''; loadData()" class="rounded border px-3 py-1 bg-green-600 text-white">Semua</button>
                    <button @click="statusFilter = 'pending'; loadData()" class="rounded border px-3 py-1">Pending</button>
                    <button @click="statusFilter = 'paid'; loadData()" class="rounded border px-3 py-1">Paid</button>
                    <button @click="statusFilter = 'failed'; loadData()" class="rounded border px-3 py-1">Failed</button>
                </div>

                <div v-if="loading" class="text-sm text-gray-500">
                    Memuat pesanan...
                </div>

                <div v-else-if="transaksi.length === 0" class="text-sm text-gray-400">
                    Belum ada pesanan
                </div>

                <div v-else class="mt-5 space-y-4">
                    <div v-for="order in transaksi" :key="order.id"
                        class="transition hover:bg-gray-100 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div class="flex flex-wrap items-center gap-3">
                                <p class="font-semibold text-slate-900">
                                    {{ order.id }}
                                </p>

                                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="{
                                    'bg-yellow-50 text-yellow-700': order.status === 'pending',
                                    'bg-green-50 text-green-700': order.status === 'paid',
                                    'bg-red-50 text-red-700': order.status === 'failed'
                                }">
                                    {{ order.status }}
                                </span>
                            </div>

                            <p class="mt-1 text-sm text-slate-500">
                                {{ formatDateTime(order.created_at) }}
                            </p>
                            <p class="mt-2 text-sm text-slate-600">
                                Obat: <span class="font-medium text-slate-900">{{ getOrderObatSummary(order) }}</span>
                            </p>
                        </div>

                        <div class="flex flex-col items-start gap-3 md:items-end">
                            <p class="text-sm font-semibold text-slate-800">
                                Rp {{ formatCurrency(order.total_harga ?? order.total) }}
                            </p>
                            <button @click="openDetail(order)" class="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                                Detail
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex justify-center gap-2">
                    <button @click="page--; loadData()" :disabled="page === 1" class="rounded border px-3 py-1">
                        Prev
                    </button>

                    <span class="px-3 py-1">
                        Page {{ page }} / {{ totalPage }}
                    </span>

                    <button @click="page++; loadData()" :disabled="page === totalPage" class="rounded border px-3 py-1">
                        Next
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>
