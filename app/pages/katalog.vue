<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

useHead({
    title: 'Katalog Obat'
})

const keyword = ref('')
const searched = ref(false)
const loading = ref(false)
const searchMessage = ref('')

const { apoteks, initNearby } = useNearbyApotek()
const { data: obatList, fetchObat } = useObatApotek()

const resultApotek = ref<any[]>([])

const totalOpenApotek = computed(() => resultApotek.value.filter(item => isOpen(item)).length)

const parseTimeToMinutes = (timeStr?: string | null): number | null => {
    if (!timeStr) return null
    const parts = String(timeStr).slice(0, 5).split(':')
    if (parts.length < 2) return null
    const h = Number(parts[0])
    const m = Number(parts[1])
    if (Number.isNaN(h) || Number.isNaN(m)) return null
    return h * 60 + m
}

const isOpen = (apotek: any) => {
    if (!apotek.jam_buka || !apotek.jam_tutup) return false

    const openTime = parseTimeToMinutes(apotek.jam_buka)
    const closeTime = parseTimeToMinutes(apotek.jam_tutup)

    if (openTime === null || closeTime === null) return false
    if (openTime === closeTime) return true

    const now = new Date()
    const current = now.getHours() * 60 + now.getMinutes()

    if (closeTime < openTime) {
        return current >= openTime || current <= closeTime
    }

    return current >= openTime && current <= closeTime
}

const formatDistance = (value: any) => {
    if (value === null || value === undefined || value === '') return 'Jarak belum tersedia'
    const amount = Number(value)
    if (Number.isNaN(amount)) return 'Jarak belum tersedia'
    if (amount < 1) return `${Math.round(amount * 1000)} m`
    return `${amount.toFixed(1)} km`
}

const searchObat = async () => {
    searchMessage.value = ''

    if (!keyword.value.trim()) {
        searchMessage.value = 'Masukkan nama obat dulu supaya kami bisa bantu carikan apotek terdekat.'
        return
    }

    loading.value = true
    searched.value = true
    resultApotek.value = []

    try {
        const loc = await initNearby()
        if (!loc) {
            searchMessage.value = 'Lokasi belum tersedia. Coba aktifkan izin lokasi lalu ulangi pencarian.'
            return
        }

        const results: any[] = []

        for (const apotek of apoteks.value) {
            await fetchObat(apotek.id, keyword.value)

            if (obatList.value.length > 0) {
                results.push({
                    id: apotek.id,
                    nama: apotek.nama,
                    alamat: apotek.alamat,
                    image: '/images/apotek1.jpg',
                    jam_buka: apotek.jam_buka,
                    jam_tutup: apotek.jam_tutup,
                    distance: apotek.distance,
                    totalObat: obatList.value.length
                })
            }
        }

        resultApotek.value = results

        if (!results.length) {
            searchMessage.value = 'Belum ada apotek terdekat yang cocok dengan kata kunci ini.'
        }

        await nextTick()

        gsap.from('.apotek-card', {
            opacity: 0,
            y: 36,
            duration: 0.55,
            stagger: 0.12
        })
    } catch (err) {
        searchMessage.value = 'Pencarian belum berhasil. Coba lagi sebentar lagi.'
    } finally {
        loading.value = false
    }
}

const resetSearch = () => {
    keyword.value = ''
    searched.value = false
    resultApotek.value = []
    searchMessage.value = ''
}

onMounted(() => {
    gsap.from('.katalog-hero', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out'
    })

    gsap.from('.search-box', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out'
    })

    gsap.from('.empty-state', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.25,
        ease: 'power3.out'
    })
})
</script>

<template>
    <AppLoadingOverlay v-if="loading" label="Memuat katalog..." />

    <div
        class="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4fbf8_0%,#ffffff_32%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#090d16_0%,#0f172a_35%,#020617_100%)] pb-24 pt-24 transition-colors duration-300">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.1),_transparent_18%)]">
        </div>

        <section class="katalog-hero relative">
            <header class="mx-auto max-w-6xl px-6 pb-8 pt-10 lg:px-8 lg:pb-10">
                <h1 class="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Cari Obat</h1>
                <p class="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">Temukan apotek yang menyediakan obat dalam radius 5 km dari lokasimu.</p>
            </header>
        </section>

        <section class="search-box relative">
            <div class="mx-auto max-w-6xl px-6 lg:px-8">
                <form class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-6" @submit.prevent="searchObat">
                    <label for="medicine-search" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Nama obat</label>
                    <div class="flex flex-col gap-3 sm:flex-row">
                        <input id="medicine-search" v-model="keyword" placeholder="Contoh: Paracetamol 500mg"
                            class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            aria-describedby="medicine-search-hint" />
                        <div class="flex gap-3">
                            <button type="submit" :disabled="loading" class="flex-1 rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-wait disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                                {{ loading ? 'Mencari...' : 'Cari Obat' }}
                            </button>
                            <button type="button" @click="resetSearch" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Reset</button>
                        </div>
                    </div>
                    <p id="medicine-search-hint" class="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Izinkan akses lokasi untuk mencari apotek terdekat.</p>
                    <p v-if="searchMessage && !searched" role="alert" class="mt-4 text-sm text-rose-600 dark:text-rose-400">{{ searchMessage }}</p>
                </form>
            </div>
        </section>

        <section v-if="!searched" class="empty-state relative mx-auto max-w-6xl px-6 py-14 text-center lg:px-8">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-4 h-9 w-9 text-emerald-600 dark:text-emerald-400">
                <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" stroke-linecap="round" />
            </svg>
            <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Obat apa yang kamu cari?</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Masukkan nama obat untuk melihat apotek yang menyediakannya.</p>
        </section>

        <section v-if="searched" class="relative mt-14">
            <div class="mx-auto max-w-6xl px-6 lg:px-8">
                <div
                    class="mb-8 rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6 transition-colors">
                    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70 dark:text-emerald-400">
                                Hasil Pencarian
                            </p>
                            <h2 class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                                Apotek yang menyediakan: "{{ keyword }}"
                            </h2>

                        </div>

                        <div class="grid gap-3 sm:grid-cols-2">
                            <div class="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                <p class="text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                                    Ditemukan
                                </p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                                    {{ resultApotek.length }}
                                </p>
                            </div>
                            <div class="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                <p class="text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                                    Sedang Buka
                                </p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                                    {{ totalOpenApotek }}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="i in 6" :key="i"
                        class="animate-pulse rounded-[28px] bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                        <div class="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                        <div class="mt-4 h-5 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div class="mt-3 h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div class="mt-2 h-4 w-4/5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div class="mt-4 grid grid-cols-2 gap-3">
                            <div class="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                            <div class="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                        <div class="mt-5 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                    </div>
                </div>

                <div v-else-if="resultApotek.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <article v-for="item in resultApotek" :key="item.id"
                        class="apotek-card group overflow-hidden rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                        <div class="relative overflow-hidden">
                            <img :src="item.image" :alt="item.nama"
                                class="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />

                            <div
                                class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent px-5 pb-5 pt-12">
                                <div class="flex items-end justify-between gap-3">
                                    <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                        :class="isOpen(item) ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'">
                                        {{ isOpen(item) ? 'Sedang buka' : 'Sedang tutup' }}
                                    </span>
                                    <span
                                        class="rounded-full bg-white/90 dark:bg-slate-900/90 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                        {{ item.totalObat }} obat cocok
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="p-5">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                                        {{ item.nama }}
                                    </h3>
                                    <p class="mt-1 text-sm text-slate-400 dark:text-slate-500">
                                        Jam operasional {{ item.jam_buka || '--:--' }} - {{ item.jam_tutup || '--:--' }}
                                    </p>
                                </div>
                            </div>

                            <p class="mt-3 line-clamp-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                                {{ item.alamat }}
                            </p>

                            <div class="mt-4 grid grid-cols-2 gap-3">
                                <div class="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 transition-colors">
                                    <p class="text-xs uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                        Status
                                    </p>
                                    <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">
                                        {{ isOpen(item) ? 'Sedang buka sekarang' : 'Belum buka / sudah tutup' }}
                                    </p>
                                </div>

                                <div class="rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 transition-colors">
                                    <p class="text-xs uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                        Jarak
                                    </p>
                                    <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">
                                        {{ formatDistance(item.distance) }}
                                    </p>
                                </div>
                            </div>

                            <NuxtLink :to="`/detailApotek/${item.id}`"
                                class="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-5 py-3 text-sm font-semibold transition">
                                Lihat Detail Apotek
                            </NuxtLink>
                        </div>
                    </article>
                </div>

                <div v-else
                    class="rounded-[30px] border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-6 py-14 text-center shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                    <div class="mx-auto max-w-md">
                        <p class="text-lg font-semibold text-slate-900 dark:text-white">
                            Belum ada hasil yang cocok
                        </p>
                        <p class="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                            {{ searchMessage || 'Coba gunakan nama obat yang lebih spesifik atau periksa ejaan kata kuncinya.' }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
