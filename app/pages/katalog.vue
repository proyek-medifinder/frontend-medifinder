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

const isOpen = (apotek: any) => {
    if (!apotek.jam_buka || !apotek.jam_tutup) return false

    const now = new Date()
    const current = now.getHours() * 60 + now.getMinutes()

    const [openH, openM] = apotek.jam_buka.split(':').map(Number)
    const [closeH, closeM] = apotek.jam_tutup.split(':').map(Number)

    const openTime = openH * 60 + openM
    const closeTime = closeH * 60 + closeM

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
                    image: '/images/istri.png',
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
    <div class="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4fbf8_0%,#ffffff_32%,#f8fafc_100%)] pb-24 pt-24">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.1),_transparent_18%)]">
        </div>

        <section class="katalog-hero relative">
            <div class="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
                <div
                    class="overflow-hidden rounded-[34px] border border-white/70 bg-white/80 px-7 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-9 sm:py-10">
                    <div class="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                        <div>
                            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-[#0f766e]/70">
                                Katalog Obat
                            </p>
                            <h1 class="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                                Cari obat yang kamu butuhkan, lalu temukan apotek terdekat yang menyediakannya.
                            </h1>
                            <p class="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                                MediFinder bantu kamu menyaring apotek yang relevan berdasarkan nama obat, supaya pencarian terasa lebih cepat dan tidak melelahkan.
                            </p>

                            <div class="mt-7 flex flex-wrap gap-3">
                                <div class="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                                    Pencarian berbasis lokasi
                                </div>
                                <div class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                                    Cek apotek yang masih aktif
                                </div>
                                <div class="rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                                    Lanjut lihat detail apotek
                                </div>
                            </div>
                        </div>

                        <div
                            class="relative overflow-hidden rounded-[30px] border border-emerald-200/70 bg-[linear-gradient(160deg,rgba(15,118,110,0.94),rgba(13,148,136,0.84))] p-6 text-white shadow-[0_24px_70px_rgba(15,118,110,0.2)]">
                            <div class="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
                            <div class="absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-yellow-300/15 blur-2xl"></div>

                            <div class="relative">
                                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                                    Ringkas & Praktis
                                </p>
                                <h2 class="mt-3 max-w-sm text-2xl font-semibold leading-tight">
                                    Temukan stok obat lebih cepat tanpa perlu cek satu per satu.
                                </h2>

                                <div class="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                                    <div class="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                                        <p class="text-xs uppercase tracking-[0.18em] text-white/65">
                                            Fokus Pencarian
                                        </p>
                                        <p class="mt-2 text-lg font-semibold">
                                            Obat & Apotek
                                        </p>
                                    </div>
                                    <div class="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                                        <p class="text-xs uppercase tracking-[0.18em] text-white/65">
                                            Hasil
                                        </p>
                                        <p class="mt-2 text-lg font-semibold">
                                            Berdasarkan Lokasi
                                        </p>
                                    </div>
                                    <div class="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                                        <p class="text-xs uppercase tracking-[0.18em] text-white/65">
                                            Update
                                        </p>
                                        <p class="mt-2 text-lg font-semibold">
                                            Data Apotek Aktif
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="search-box relative mt-2">
            <div class="mx-auto max-w-6xl px-6 lg:px-8">
                <div
                    class="rounded-[30px] border border-emerald-200/70 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0.95))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6">
                    <div class="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
                        <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                            <div class="flex-1">
                            <label class="mb-2 block text-sm font-medium text-slate-600">
                                Nama obat
                            </label>
                            <input v-model="keyword" placeholder="Contoh: Paracetamol 500mg"
                                class="w-full rounded-2xl border border-white bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100"
                                @keyup.enter="searchObat" />
                        </div>

                            <div class="flex gap-3 lg:pt-0">
                                <button @click="searchObat" :disabled="loading"
                                    class="flex-1 rounded-2xl bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:bg-[#0f766e]/70">
                                    {{ loading ? 'Mencari...' : 'Tampilkan Hasil' }}
                                </button>

                                <button @click="resetSearch"
                                    class="flex-1 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div
                            class="rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 text-sm text-slate-500 shadow-sm backdrop-blur xl:max-w-xs">
                            <p class="font-semibold text-slate-900">
                                Tips pencarian
                            </p>
                            <p class="mt-2 leading-6">
                                Gunakan nama obat yang paling umum supaya hasil yang muncul lebih cepat dan lebih relevan.
                            </p>
                        </div>
                    </div>

                    <div class="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <div class="rounded-full bg-white/80 px-4 py-2 text-slate-600 shadow-sm">
                            Hasil diprioritaskan dari apotek terdekat
                        </div>
                        <div class="rounded-full bg-white/80 px-4 py-2 text-slate-600 shadow-sm">
                            Cek detail apotek untuk info obat lebih lengkap
                        </div>
                    </div>

                    <p v-if="searchMessage && !searched" class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
                        {{ searchMessage }}
                    </p>
                </div>
            </div>
        </section>

        <section v-if="!searched" class="empty-state relative mt-14">
            <div class="mx-auto max-w-6xl px-6 lg:px-8">
                <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div
                        class="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8">
                        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f766e]/70">
                            Mulai Dari Sini
                        </p>
                        <h2 class="mt-3 text-3xl font-semibold leading-tight text-slate-900">
                            Satu pencarian untuk bantu kamu menuju apotek yang paling relevan.
                        </h2>
                        <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                            Tulis nama obat, izinkan akses lokasi, lalu MediFinder akan membantu menyaring apotek terdekat yang kemungkinan menyediakan kebutuhanmu.
                        </p>

                        <div class="mt-8 grid gap-4 md:grid-cols-3">
                            <div class="rounded-[24px] bg-slate-50 px-5 py-5">
                                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Langkah 1
                                </p>
                                <h3 class="mt-3 text-lg font-semibold text-slate-900">
                                    Tulis nama obat
                                </h3>
                                <p class="mt-2 text-sm leading-6 text-slate-500">
                                    Cukup ketik nama yang paling familiar agar pencarian lebih mudah mengenali kebutuhanmu.
                                </p>
                            </div>

                            <div class="rounded-[24px] bg-slate-50 px-5 py-5">
                                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Langkah 2
                                </p>
                                <h3 class="mt-3 text-lg font-semibold text-slate-900">
                                    Gunakan lokasi
                                </h3>
                                <p class="mt-2 text-sm leading-6 text-slate-500">
                                    Lokasi membantumu melihat apotek yang dekat, jadi proses mencari obat terasa lebih praktis.
                                </p>
                            </div>

                            <div class="rounded-[24px] bg-slate-50 px-5 py-5">
                                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Langkah 3
                                </p>
                                <h3 class="mt-3 text-lg font-semibold text-slate-900">
                                    Pilih apotek terbaik
                                </h3>
                                <p class="mt-2 text-sm leading-6 text-slate-500">
                                    Buka halaman detail apotek untuk melihat informasi lebih lanjut sebelum datang atau memesan.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="rounded-[30px] border border-emerald-100 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-7">
                        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f766e]/70">
                            Kenapa Nyaman
                        </p>
                        <div class="mt-5 space-y-4">
                            <div class="rounded-2xl bg-white px-5 py-4 shadow-sm">
                                <h3 class="text-base font-semibold text-slate-900">
                                    Cari apotek terdekat
                                </h3>
                                <p class="mt-2 text-sm leading-6 text-slate-500">
                                    Ketik nama obat yang kamu cari, lalu biarkan MediFinder menampilkan apotek yang relevan di sekitarmu.
                                </p>
                            </div>

                            <div class="rounded-2xl bg-white px-5 py-4 shadow-sm">
                                <h3 class="text-base font-semibold text-slate-900">
                                    Lihat ketersediaan
                                </h3>
                                <p class="mt-2 text-sm leading-6 text-slate-500">
                                    Hasil pencarian membantu kamu menyaring apotek yang punya obat sesuai kebutuhanmu.
                                </p>
                            </div>

                            <div class="rounded-2xl bg-white px-5 py-4 shadow-sm">
                                <h3 class="text-base font-semibold text-slate-900">
                                    Data apotek aktif
                                </h3>
                                <p class="mt-2 text-sm leading-6 text-slate-500">
                                    Semua hasil difokuskan ke apotek yang bisa kamu lanjutkan cek detailnya dengan cepat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="searched" class="relative mt-14">
            <div class="mx-auto max-w-6xl px-6 lg:px-8">
                <div
                    class="mb-8 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6">
                    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70">
                                Hasil Pencarian
                            </p>
                            <h2 class="mt-2 text-2xl font-semibold text-slate-900">
                                Apotek yang menyediakan: "{{ keyword }}"
                            </h2>
                            <p class="mt-2 text-sm leading-6 text-slate-500">
                                Hasil ini disusun dari apotek terdekat yang punya kecocokan dengan kata kunci yang kamu cari.
                            </p>
                        </div>

                        <div class="grid gap-3 sm:grid-cols-3">
                            <div class="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                                <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                                    Ditemukan
                                </p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">
                                    {{ resultApotek.length }}
                                </p>
                            </div>
                            <div class="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                                <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                                    Sedang Buka
                                </p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">
                                    {{ totalOpenApotek }}
                                </p>
                            </div>
                            <div class="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                                <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                                    Kata Kunci
                                </p>
                                <p class="mt-2 line-clamp-1 text-base font-semibold text-slate-900">
                                    {{ keyword }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="i in 6" :key="i"
                        class="animate-pulse rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                        <div class="h-44 rounded-2xl bg-slate-200"></div>
                        <div class="mt-4 h-5 w-2/3 rounded-full bg-slate-200"></div>
                        <div class="mt-3 h-4 w-full rounded-full bg-slate-200"></div>
                        <div class="mt-2 h-4 w-4/5 rounded-full bg-slate-200"></div>
                        <div class="mt-4 grid grid-cols-2 gap-3">
                            <div class="h-16 rounded-2xl bg-slate-200"></div>
                            <div class="h-16 rounded-2xl bg-slate-200"></div>
                        </div>
                        <div class="mt-5 h-11 rounded-2xl bg-slate-200"></div>
                    </div>
                </div>

                <div v-else-if="resultApotek.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <article v-for="item in resultApotek" :key="item.id"
                        class="apotek-card group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                        <div class="relative overflow-hidden">
                            <img :src="item.image" :alt="item.nama"
                                class="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />

                            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent px-5 pb-5 pt-12">
                                <div class="flex items-end justify-between gap-3">
                                    <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                        :class="isOpen(item) ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'">
                                        {{ isOpen(item) ? 'Sedang buka' : 'Sedang tutup' }}
                                    </span>
                                    <span class="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {{ item.totalObat }} obat cocok
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="p-5">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900">
                                        {{ item.nama }}
                                    </h3>
                                    <p class="mt-1 text-sm text-slate-400">
                                        Jam operasional {{ item.jam_buka || '--:--' }} - {{ item.jam_tutup || '--:--' }}
                                    </p>
                                </div>
                            </div>

                            <p class="mt-3 line-clamp-2 text-sm leading-7 text-slate-500">
                                {{ item.alamat }}
                            </p>

                            <div class="mt-4 grid grid-cols-2 gap-3">
                                <div class="rounded-2xl bg-slate-50 px-4 py-3">
                                    <p class="text-xs uppercase tracking-[0.14em] text-slate-400">
                                        Status
                                    </p>
                                    <p class="mt-1 text-sm font-semibold text-slate-900">
                                        {{ isOpen(item) ? 'Sedang buka sekarang' : 'Belum buka / sudah tutup' }}
                                    </p>
                                </div>

                                <div class="rounded-2xl bg-slate-50 px-4 py-3">
                                    <p class="text-xs uppercase tracking-[0.14em] text-slate-400">
                                        Jarak
                                    </p>
                                    <p class="mt-1 text-sm font-semibold text-slate-900">
                                        {{ formatDistance(item.distance) }}
                                    </p>
                                </div>
                            </div>

                            <NuxtLink :to="`/detailApotek/${item.id}`"
                                class="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300">
                                Lihat Detail Apotek
                            </NuxtLink>
                        </div>
                    </article>
                </div>

                <div v-else
                    class="rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                    <div class="mx-auto max-w-md">
                        <p class="text-lg font-semibold text-slate-900">
                            Belum ada hasil yang cocok
                        </p>
                        <p class="mt-3 text-sm leading-7 text-slate-500">
                            {{ searchMessage || 'Coba gunakan nama obat yang lebih spesifik atau periksa ejaan kata kuncinya.' }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
