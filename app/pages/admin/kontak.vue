<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
    layout: "admin",
    middleware: 'admin'
})

useHead({
    title: "Daftar Pesan Masuk"
})

const {
    pesan,
    loading,
    fetchPesan,
    fetchDetail,
    detail
} = useKontakAdmin()

onMounted(() => {
    fetchPesan()
})

const currentPage = ref(1)
const perPage = 5

const totalPages = computed(() =>
    Math.max(1, Math.ceil(pesan.value.length / perPage))
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return pesan.value.slice(start, start + perPage)
})

const openModal = ref(false)
const detailLoading = ref(false)
const selectedContact = ref<any>(null)

const displayedDetail = computed(() => {
    if (detail.value && (detail.value.nama || detail.value.email || detail.value.subjek || detail.value.pesan)) {
        return detail.value
    }

    return selectedContact.value
})

const formatDateTime = (value: any) => {
    if (!value) return '-'

    const raw = typeof value === 'string'
        ? value
        : value?.Time || value?.time || value?.value || value?.Date || value?.date || null

    if (!raw) return '-'

    const date = new Date(raw)
    if (Number.isNaN(date.getTime())) return String(raw)

    return date.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    })
}

const normalizeStatus = (value?: string | null) =>
    String(value || '').trim().toUpperCase()

const statusBadgeClass = (value?: string | null) => {
    const status = normalizeStatus(value)

    if (status === 'READ') {
        return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
    }

    return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
}

const openDetail = async (item: any) => {
    try {
        detailLoading.value = true
        selectedContact.value = item
        detail.value = null
        openModal.value = true
        await fetchDetail(item.id)
    } finally {
        detailLoading.value = false
    }
}

const closeDetail = () => {
    openModal.value = false
    detail.value = null
    selectedContact.value = null
}
</script>

<template>
    <AppLoadingOverlay
        v-if="loading"
        label="Memuat pesan kontak..."
        description="Pesan masuk sedang diambil dari API."
    />

    <div
        v-if="openModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
    >
        <div class="w-full max-w-3xl rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
            <div class="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600/70">
                        Detail Pesan
                    </p>
                    <h2 class="mt-2 text-2xl font-semibold text-slate-900">
                        {{ displayedDetail?.nama || 'Pesan masuk' }}
                    </h2>
                    <p class="mt-2 text-sm text-slate-500">
                        Informasi lengkap pesan yang dikirim pengguna.
                    </p>
                </div>

                <button
                    @click="closeDetail"
                    class="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-200"
                >
                    Tutup
                </button>
            </div>

            <div class="mt-6 space-y-4">
                <div v-if="detailLoading" class="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    Memuat detail tambahan dari API...
                </div>

                <div v-if="displayedDetail" class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div class="space-y-4">
                        <div class="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Nama Pengirim</p>
                                    <p class="mt-2 text-xl font-semibold text-slate-900">
                                        {{ displayedDetail?.nama || '-' }}
                                    </p>
                                </div>

                                <span
                                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="statusBadgeClass(displayedDetail?.status)"
                                >
                                    {{ displayedDetail?.status || 'UNREAD' }}
                                </span>
                            </div>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="rounded-3xl border border-slate-200 bg-white p-4">
                                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
                                <p class="mt-2 break-all font-semibold text-slate-900">
                                    {{ displayedDetail?.email || '-' }}
                                </p>
                            </div>

                            <div class="rounded-3xl border border-slate-200 bg-white p-4">
                                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Waktu Masuk</p>
                                <p class="mt-2 font-semibold text-slate-900">
                                    {{ formatDateTime(displayedDetail?.created_at) }}
                                </p>
                            </div>

                            <div class="rounded-3xl border border-slate-200 bg-white p-4 sm:col-span-2">
                                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Subjek</p>
                                <p class="mt-2 font-semibold text-slate-900">
                                    {{ displayedDetail?.subjek || '-' }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                        <p class="text-xs uppercase tracking-[0.18em] text-slate-400">ID Pesan</p>
                        <p class="mt-2 break-all font-mono text-xs text-slate-500">
                            {{ displayedDetail?.id || '-' }}
                        </p>

                        <div class="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-4">
                            <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Isi Pesan</p>
                            <p class="mt-3 whitespace-pre-line leading-7 text-slate-700">
                                {{ displayedDetail?.pesan || '-' }}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    v-else
                    class="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500"
                >
                    Detail pesan tidak ditemukan.
                </div>
            </div>
        </div>
    </div>

    <div class="space-y-6">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Data Pesan
        </h1>

        <div
            class="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
        >
            <div class="border-b border-gray-300 py-4 text-center font-semibold">
                Daftar Pesan yang Masuk
            </div>

            <table class="w-full text-sm">
                <thead class="border-b border-gray-300 bg-gray-50 text-gray-700">
                    <tr>
                        <th class="px-6 py-3 text-left">ID</th>
                        <th class="px-6 py-3 text-left">Nama Pengirim</th>
                        <th class="px-6 py-3 text-left">Email</th>
                        <th class="px-6 py-3 text-left">Subjek</th>
                        <th class="px-6 py-3 text-left">Status</th>
                        <th class="px-6 py-3 text-left">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="item in paginatedData"
                        :key="item.id"
                        class="border-b border-gray-300 hover:bg-gray-50"
                    >
                        <td class="px-6 py-4 font-mono text-xs text-slate-500">
                            {{ item.id?.slice(0, 8) || '-' }}
                        </td>
                        <td class="px-6 py-4 font-medium text-slate-900">
                            {{ item.nama || '-' }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.email || '-' }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.subjek || '-' }}
                        </td>
                        <td class="px-6 py-4">
                            <span
                                class="rounded-full px-3 py-1 text-xs font-semibold"
                                :class="statusBadgeClass(item.status)"
                            >
                                {{ item.status || 'UNREAD' }}
                            </span>
                        </td>

                        <td class="px-6 py-4">
                            <button
                                @click="openDetail(item)"
                                class="rounded-lg border border-blue-500 px-4 py-1.5 text-xs text-blue-500 transition hover:bg-blue-50"
                            >
                                Detail
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="flex items-center justify-end gap-2 bg-gray-100 px-6 py-4">
                <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="rounded border px-3 py-1 disabled:opacity-40"
                >
                    Prev
                </button>

                <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                        'rounded border px-3 py-1 text-sm',
                        currentPage === page
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'bg-white'
                    ]"
                >
                    {{ page }}
                </button>

                <button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="rounded border px-3 py-1 disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>
