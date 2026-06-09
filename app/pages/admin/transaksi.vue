<script setup lang="ts">
import { computed, ref, watch } from 'vue'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({
    title: 'Daftar Transaksi'
})

const search = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const perPage = 10
const showDetailModal = ref(false)
const detailLoading = ref(false)
const selectedTransaction = ref<any | null>(null)
const selectedTransactionItems = ref<any[]>([])
const transactionObatSummaryMap = ref<Record<string, string>>({})

const { transaksi, loading, totalPage, error, fetchTransaksi, getDetail } = useTransaksi()
const { enrichItems, summarizeItems } = useTransactionObatNames()

const loadData = async () => {
    await fetchTransaksi({
        status: statusFilter.value || undefined,
        page: currentPage.value,
        limit: perPage
    })
    await enrichTransactionHistory()
}

const filteredData = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    if (!keyword) return transaksi.value

    return transaksi.value.filter((item: any) =>
        `${item.id} ${item.user_id} ${item.apotek_id} ${item.status}`.toLowerCase().includes(keyword)
    )
})

const totalTransaksi = computed(() => transaksi.value.length)
const totalPendapatan = computed(() =>
    transaksi.value.reduce((sum: number, item: any) => sum + Number(item.total_harga ?? item.total ?? 0), 0)
)
const totalSelesai = computed(() =>
    transaksi.value.filter((item: any) => String(item.status).toLowerCase() === 'paid').length
)

const formatCurrency = (value: number | string | null | undefined) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(Number(value || 0))

const formatDateTime = (value?: string | null) => {
    if (!value) return '-'
    return new Date(value).toLocaleString('id-ID')
}

const getTransactionObatSummary = (item: any) =>
    transactionObatSummaryMap.value[item?.id] || item?.obat_nama || '-'

const statusClass = (status?: string) => {
    const normalized = String(status || '').toLowerCase()

    if (normalized === 'pending') return 'bg-yellow-200 text-yellow-800'
    if (normalized === 'paid') return 'bg-green-200 text-green-800'
    if (normalized === 'failed' || normalized === 'cancelled') return 'bg-red-200 text-red-800'
    return 'bg-slate-200 text-slate-700'
}

const openDetail = async (transaction: any) => {
    try {
        detailLoading.value = true
        showDetailModal.value = true
        selectedTransaction.value = transaction
        const res: any = await getDetail(transaction.id)
        const detailItems = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
        selectedTransactionItems.value = await enrichItems(transaction.apotek_id, detailItems)
    } catch (err) {
        console.error('Gagal ambil detail transaksi', err)
        selectedTransaction.value = null
        selectedTransactionItems.value = []
    } finally {
        detailLoading.value = false
    }
}

const enrichTransactionHistory = async () => {
    transactionObatSummaryMap.value = {}

    await Promise.all(transaksi.value.map(async (item: any) => {
        try {
            const res: any = await getDetail(item.id)
            const detailItems = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
            await enrichItems(item.apotek_id, detailItems)
            transactionObatSummaryMap.value[item.id] = await summarizeItems(item.apotek_id, detailItems)
        } catch {
            transactionObatSummaryMap.value[item.id] = '-'
        }
    }))
}

watch(statusFilter, async () => {
    currentPage.value = 1
    await loadData()
})

onMounted(loadData)
</script>

<template>
    <AppLoadingOverlay v-if="loading" label="Memuat transaksi..." description="Riwayat transaksi sedang diambil dari API." />

    <div class="space-y-6">
        <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4">
            <div class="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-semibold">Detail Transaksi</h2>
                        <p class="mt-1 text-sm text-slate-500">Ringkasan transaksi lengkap dari API.</p>
                    </div>

                    <button @click="showDetailModal = false" class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200">
                        Tutup
                    </button>
                </div>

                <div v-if="detailLoading" class="mt-6 text-sm text-slate-500">
                    Memuat detail transaksi...
                </div>

                <div v-else-if="selectedTransaction" class="mt-6 space-y-4 text-sm text-slate-700">
                    <p><b>ID:</b> {{ selectedTransaction.id }}</p>
                    <p><b>User ID:</b> {{ selectedTransaction.user_id || '-' }}</p>
                    <p><b>Apotek ID:</b> {{ selectedTransaction.apotek_id || '-' }}</p>
                    <p><b>Status:</b> {{ selectedTransaction.status || '-' }}</p>
                    <p><b>Total:</b> {{ formatCurrency(selectedTransaction.total_harga ?? selectedTransaction.total) }}</p>
                    <p><b>Snap Token:</b> {{ selectedTransaction.snap_token || '-' }}</p>
                    <p><b>Payment URL:</b> <span class="break-all">{{ selectedTransaction.payment_url || '-' }}</span></p>
                    <p><b>Dibuat:</b> {{ formatDateTime(selectedTransaction.created_at) }}</p>
                    <p><b>Diperbarui:</b> {{ formatDateTime(selectedTransaction.updated_at) }}</p>

                    <div class="pt-3">
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
                                <p><b>Harga:</b> {{ formatCurrency(item.harga) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Daftar Riwayat Transaksi
        </h1>

        <div class="grid gap-5 md:grid-cols-3">
            <div class="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <p class="text-sm text-gray-500">Total Transaksi</p>
                <p class="text-2xl font-bold">{{ totalTransaksi }}</p>
            </div>

            <div class="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <p class="text-sm text-gray-500">Total Pendapatan</p>
                <p class="text-2xl font-bold">{{ formatCurrency(totalPendapatan) }}</p>
            </div>

            <div class="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <p class="text-sm text-gray-500">Transaksi Selesai</p>
                <p class="text-2xl font-bold">{{ totalSelesai }}</p>
            </div>
        </div>

        <div class="flex flex-col gap-4 md:flex-row">
            <input v-model="search" placeholder="Cari ID transaksi, user, atau apotek..."
                class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 outline-none md:max-w-md" />

            <select v-model="statusFilter"
                class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 outline-none md:w-65">
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>

        <div class="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div v-if="loading" class="px-6 py-6 text-center text-gray-500">
                Memuat data transaksi...
            </div>

            <div v-else-if="error" class="px-6 py-6 text-center text-red-500">
                {{ error }}
            </div>

            <template v-else>
                <table class="w-full text-sm">
                    <thead class="border-b border-gray-300 text-gray-700">
                        <tr>
                            <th class="px-6 py-3">ID</th>
                            <th class="px-6 py-3">User ID</th>
                            <th class="px-6 py-3">Apotek ID</th>
                            <th class="px-6 py-3">Obat</th>
                            <th class="px-6 py-3">Total</th>
                            <th class="px-6 py-3">Status</th>
                            <th class="px-6 py-3">Tanggal</th>
                            <th class="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="filteredData.length === 0">
                            <td colspan="8" class="px-6 py-6 text-center text-gray-400">
                                Tidak ada transaksi yang cocok.
                            </td>
                        </tr>

                        <tr v-for="item in filteredData" :key="item.id" class="border-b border-gray-300 hover:bg-gray-50">
                            <td class="px-6 py-4">{{ item.id }}</td>
                            <td class="px-6 py-4">{{ item.user_id }}</td>
                            <td class="px-6 py-4">{{ item.apotek_id }}</td>
                            <td class="px-6 py-4 text-slate-600">
                                {{ getTransactionObatSummary(item) }}
                            </td>
                            <td class="px-6 py-4 font-semibold">
                                {{ formatCurrency(item.total_harga ?? item.total) }}
                            </td>

                            <td class="px-6 py-4">
                                <span :class="statusClass(item.status)" class="px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                    {{ item.status }}
                                </span>
                            </td>

                            <td class="px-6 py-4">
                                {{ formatDateTime(item.created_at) }}
                            </td>

                            <td class="px-6 py-4">
                                <button @click="openDetail(item)" class="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                                    Detail
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="flex justify-center gap-2 py-5 bg-gray-100">
                    <button @click="currentPage--; loadData()" :disabled="currentPage === 1" class="px-4 py-2 rounded-lg text-sm bg-white border disabled:opacity-40">
                        Prev
                    </button>

                    <span class="px-4 py-2 text-sm">
                        {{ currentPage }} / {{ totalPage }}
                    </span>

                    <button @click="currentPage++; loadData()" :disabled="currentPage === totalPage" class="px-4 py-2 rounded-lg text-sm bg-white border disabled:opacity-40">
                        Next
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>
