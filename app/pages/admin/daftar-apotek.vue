<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({
    title: 'Daftar Apotek'
})

const { apoteks, loading, fetchApotek } = useApotekList()
const config = useRuntimeConfig()

const search = ref('')
const currentPage = ref(1)
const perPage = 4
const selectedApotek = ref<any | null>(null)
const showDetailModal = ref(false)

onMounted(() => {
    fetchApotek()
})

const resolveImageUrl = (item: any) => {
    const url = item?.photo_url || item?.PhotoURL || item?.photoUrl || ''

    if (!url) return '/images/istri.png'
    if (String(url).startsWith('http://') || String(url).startsWith('https://')) return url

    const slash = String(url).startsWith('/') ? '' : '/'
    return `${config.public.apiBase}${slash}${url}`
}

const formatDate = (value?: string | null) => {
    if (!value) return '-'
    return new Date(value).toLocaleString('id-ID')
}

const formatCoordinate = (value?: number | string | null) => {
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric.toFixed(5) : '-'
}

const formatOperationalHours = (item: any) => {
    if (!item?.jam_buka || !item?.jam_tutup) return 'Belum diatur'
    return `${String(item.jam_buka).slice(0, 5)} - ${String(item.jam_tutup).slice(0, 5)}`
}

const getVerificationLabel = (item: any) => {
    const status = String(item?.verification_status || item?.status || '').toUpperCase()
    if (status === 'APPROVED' || status === 'APPROVED_ADMIN') return 'Terverifikasi'
    if (status === 'PENDING') return 'Menunggu review'
    if (status === 'REJECTED') return 'Ditolak'
    return status || 'Belum diketahui'
}

const getVerificationBadge = (item: any) => {
    const status = String(item?.verification_status || item?.status || '').toUpperCase()
    if (status === 'APPROVED' || status === 'APPROVED_ADMIN') return 'bg-emerald-100 text-emerald-700'
    if (status === 'PENDING') return 'bg-amber-100 text-amber-700'
    if (status === 'REJECTED') return 'bg-rose-100 text-rose-700'
    return 'bg-slate-100 text-slate-600'
}

const filteredData = computed(() => {
    const needle = search.value.toLowerCase()

    return apoteks.value.filter(item =>
        `${item.nama || ''} ${item.alamat || ''} ${item.phone_number || ''}`.toLowerCase().includes(needle)
    )
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredData.value.length / perPage))
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredData.value.slice(start, start + perPage)
})

watch(search, () => {
    currentPage.value = 1
})

watch(filteredData, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
    }
})

const openDetail = (item: any) => {
    selectedApotek.value = item
    showDetailModal.value = true
}

const closeDetail = () => {
    showDetailModal.value = false
    selectedApotek.value = null
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
    <div class="space-y-6">
        <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <p class="text-sm uppercase tracking-[0.24em] text-cyan-700/80">
                    Super Admin
                </p>
                <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    Data Apotek
                </h1>
                <p class="mt-2 text-sm text-slate-500">
                    Lihat jaringan apotek yang sudah terdaftar lengkap dengan status verifikasi, jam operasional, dan detail profil.
                </p>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                    Total apotek
                </p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">
                    {{ filteredData.length }}
                </p>
            </div>
        </section>

        <div class="relative w-full max-w-md">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
            </span>

            <input v-model="search" type="text" placeholder="Cari apotek, alamat, atau nomor kontak"
                class="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" />
        </div>

        <div class="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div class="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h2 class="font-semibold text-slate-800">
                        Daftar Apotek Tersedia
                    </h2>
                    <p class="mt-1 text-sm text-slate-500">
                        Buka detail apotek langsung dari tabel saat ingin meninjau profil lengkapnya.
                    </p>
                </div>

                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {{ currentPage }} / {{ totalPages }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead class="bg-slate-50 text-slate-500">
                        <tr>
                            <th class="px-6 py-4 text-left font-medium">Apotek</th>
                            <th class="px-6 py-4 text-left font-medium">Kontak</th>
                            <th class="px-6 py-4 text-left font-medium">Operasional</th>
                            <th class="px-6 py-4 text-left font-medium">Lokasi Singkat</th>
                            <th class="px-6 py-4 text-left font-medium">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="loading">
                            <td colspan="5" class="px-6 py-8 text-center text-slate-400">
                                Memuat data apotek...
                            </td>
                        </tr>

                        <tr v-else-if="paginatedData.length === 0">
                            <td colspan="5" class="px-6 py-8 text-center text-slate-400">
                                Data apotek kosong
                            </td>
                        </tr>

                        <tr v-else v-for="item in paginatedData" :key="item.id"
                            class="border-t border-slate-100 align-top transition hover:bg-slate-50/80">
                            <td class="px-6 py-4">
                                <div class="flex items-start gap-3">
                                    <img :src="resolveImageUrl(item)" class="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-200" />
                                    <div>
                                        <p class="font-semibold text-slate-900">{{ item.nama || '-' }}</p>
                                        <div class="mt-2 flex flex-wrap gap-2">
                                            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="getVerificationBadge(item)">
                                                {{ getVerificationLabel(item) }}
                                            </span>
                                            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                ID: {{ String(item.id || '-').slice(0, 12) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td class="px-6 py-4">
                                <p class="font-medium text-slate-800">{{ item.phone_number || '-' }}</p>
                                <p class="mt-1 text-xs text-slate-500">{{ item.admin_id ? `Admin: ${String(item.admin_id).slice(0, 10)}...` : 'Admin belum terhubung' }}</p>
                            </td>

                            <td class="px-6 py-4">
                                <p class="font-medium text-slate-800">{{ formatOperationalHours(item) }}</p>
                                <p class="mt-1 text-xs text-slate-500">{{ item.deskripsi || 'Belum ada deskripsi' }}</p>
                            </td>

                            <td class="px-6 py-4">
                                <p class="font-medium text-slate-800">{{ item.alamat || '-' }}</p>
                                <p class="mt-1 text-xs text-slate-500">
                                    Lat {{ formatCoordinate(item.latitude) }} | Lng {{ formatCoordinate(item.longitude) }}
                                </p>
                            </td>

                            <td class="px-6 py-4">
                                <div class="flex flex-wrap gap-2">
                                    <button @click="openDetail(item)"
                                        class="rounded-xl bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700">
                                        Detail Cepat
                                    </button>
                                    <NuxtLink :to="`/detailApotek/${item.id}`"
                                        class="rounded-xl border border-cyan-200 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50">
                                        Halaman Detail
                                    </NuxtLink>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex flex-col gap-3 border-t px-6 py-4 md:flex-row md:items-center md:justify-between">
                <span class="text-sm text-slate-600">
                    Halaman {{ currentPage }} dari {{ totalPages }}
                </span>

                <div class="flex gap-2">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">
                        Prev
                    </button>

                    <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="page === currentPage
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'" class="rounded-xl px-3 py-2 text-sm transition">
                        {{ page }}
                    </button>

                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showDetailModal && selectedApotek" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div class="w-full max-w-3xl rounded-[32px] bg-white p-6 shadow-2xl">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-sm uppercase tracking-[0.2em] text-cyan-600">
                            Detail Apotek
                        </p>
                        <h2 class="mt-2 text-2xl font-semibold text-slate-900">
                            {{ selectedApotek.nama || '-' }}
                        </h2>
                        <p class="mt-2 text-sm text-slate-500">
                            Ringkasan profil apotek langsung dari data tabel super admin.
                        </p>
                    </div>

                    <button @click="closeDetail"
                        class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-200">
                        Tutup
                    </button>
                </div>

                <div class="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
                    <div class="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                        <img :src="resolveImageUrl(selectedApotek)" class="h-full w-full object-cover" />
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Status Verifikasi</p>
                            <p class="mt-2 font-semibold text-slate-900">{{ getVerificationLabel(selectedApotek) }}</p>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Jam Operasional</p>
                            <p class="mt-2 font-semibold text-slate-900">{{ formatOperationalHours(selectedApotek) }}</p>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Nomor Kontak</p>
                            <p class="mt-2 font-semibold text-slate-900">{{ selectedApotek.phone_number || '-' }}</p>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dibuat</p>
                            <p class="mt-2 font-semibold text-slate-900">{{ formatDate(selectedApotek.created_at) }}</p>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:col-span-2">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Alamat</p>
                            <p class="mt-2 font-semibold text-slate-900">{{ selectedApotek.alamat || '-' }}</p>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:col-span-2">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Deskripsi</p>
                            <p class="mt-2 leading-7 text-slate-700">{{ selectedApotek.deskripsi || 'Belum ada deskripsi apotek.' }}</p>
                        </div>
                        <div class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:col-span-2">
                            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Koordinat</p>
                            <p class="mt-2 font-semibold text-slate-900">
                                Lat {{ formatCoordinate(selectedApotek.latitude) }} | Lng {{ formatCoordinate(selectedApotek.longitude) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex justify-end">
                    <NuxtLink :to="`/detailApotek/${selectedApotek.id}`"
                        class="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700">
                        Buka Halaman Detail
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
