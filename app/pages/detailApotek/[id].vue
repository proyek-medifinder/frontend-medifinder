<script setup lang="ts">
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const apotek = ref<any>(null)
const loading = ref(true)

const { addToCart } = useCart()
const { user } = useAuth()

const showLoginDialog = ref(false)
const selectedObat = ref<any>(null)

const fetchDetail = async () => {
    try {
        const res: any = await $fetch(
            `${config.public.apiBase}/apotek/${route.params.id}`,
            {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )

        apotek.value = res.data
    } catch (err) {
        console.error('Gagal ambil detail apotek', err)
    } finally {
        loading.value = false
    }
}

const getImage = (url: string | null) => {
    if (!url || url.trim() === '') return '/images/apotek1.jpg'

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }

    const slash = url.startsWith('/') ? '' : '/'
    return `${config.public.apiBase}${slash}${url}`
}

const getApotekImage = (item: any) =>
    getImage(
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
        null
    )

const formatTime = (time: string | null) => {
    if (!time) return '-'
    return time.length >= 5 ? time.slice(0, 5) : time
}

const isOpen = computed(() => {
    if (!apotek.value?.jam_buka || !apotek.value?.jam_tutup) return false

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const openParts = formatTime(apotek.value.jam_buka).split(':').map(Number)
    const closeParts = formatTime(apotek.value.jam_tutup).split(':').map(Number)

    const openHour = openParts[0]
    const openMinute = openParts[1]
    const closeHour = closeParts[0]
    const closeMinute = closeParts[1]

    if (
        openHour === undefined ||
        openMinute === undefined ||
        closeHour === undefined ||
        closeMinute === undefined ||
        Number.isNaN(openHour) ||
        Number.isNaN(openMinute) ||
        Number.isNaN(closeHour) ||
        Number.isNaN(closeMinute)
    ) {
        return false
    }

    const openMinutes = openHour * 60 + openMinute
    const closeMinutes = closeHour * 60 + closeMinute

    // 🔥 CASE 1: normal
    if (openMinutes < closeMinutes) {
        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
    }

    // 🔥 CASE 2: lewat tengah malam
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes
})

const infoCards = computed(() => {
    if (!apotek.value) return []

    return [
        {
            label: 'Status',
            value: isOpen.value ? 'Sedang buka' : 'Sedang tutup',
            icon: 'solar:clock-circle-bold-duotone',
            tone: isOpen.value ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
        },
        {
            label: 'Jam Operasional',
            value: `${formatTime(apotek.value.jam_buka)} - ${formatTime(apotek.value.jam_tutup)}`,
            icon: 'solar:calendar-mark-bold-duotone',
            tone: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400'
        },
        {
            label: 'Nomor Telepon',
            value: apotek.value.phone_number || 'Belum tersedia',
            icon: 'solar:phone-bold-duotone',
            tone: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
        },
        {
            label: 'Jumlah Obat',
            value: `${apotek.value.obats?.length || 0} item`,
            icon: 'solar:pills-3-bold-duotone',
            tone: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400'
        }
    ]
})

const stockSummary = computed(() => {
    const items = apotek.value?.obats || []

    return {
        total: items.length,
        low: items.filter((item: any) => item.Stok <= 10).length,
        safe: items.filter((item: any) => item.Stok > 10).length
    }
})

const handleAddToCart = (obat: any) => {
    if (!user.value) {
        selectedObat.value = obat
        showLoginDialog.value = true
        return
    }

    addToCart(obat)
}

const goLogin = () => {
    showLoginDialog.value = false

    router.push({
        path: '/login',
        query: {
            redirect: route.fullPath
        }
    })
}

onMounted(fetchDetail)

useHead({
    title: 'Detail Apotek'
})
</script>

<template>
    <AppLoadingOverlay v-if="loading" label="Memuat detail apotek..." description="Profil apotek sedang diambil dari API." />

    <div v-if="showLoginDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
        <div class="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 text-center shadow-2xl">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                <Icon icon="solar:cart-large-4-bold-duotone" class="h-8 w-8" />
            </div>

            <h2 class="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                Login dulu untuk lanjut
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {{ selectedObat?.Nama ? `Obat ${selectedObat.Nama} akan ditambahkan ke keranjang setelah kamu login.` :
                    'Silakan login terlebih dahulu untuk menambahkan obat ke keranjang.' }}
            </p>

            <div class="mt-6 flex gap-3">
                <button @click="showLoginDialog = false"
                    class="flex-1 rounded-2xl bg-slate-100 dark:bg-slate-800 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-slate-700">
                    Nanti saja
                </button>

                <button @click="goLogin"
                    class="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    Login sekarang
                </button>
            </div>
        </div>
    </div>

    <div class="min-h-screen bg-[#f7fbfa] dark:bg-slate-950 pt-28 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <div v-if="loading" class="mx-auto max-w-6xl px-4 pb-16">
            <div class="animate-pulse space-y-6">
                <div class="h-[360px] rounded-[36px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800"></div>
                <div class="grid gap-5 md:grid-cols-4">
                    <div v-for="item in 4" :key="item" class="h-32 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800"></div>
                </div>
                <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <div class="h-80 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800"></div>
                    <div class="h-80 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800"></div>
                </div>
            </div>
        </div>

        <div v-else-if="apotek" class="pb-16">
            <section class="mx-auto max-w-6xl px-4">
                <div
                    class="relative overflow-hidden rounded-[36px] border border-white/60 dark:border-slate-800 shadow-[0_30px_80px_rgba(15,118,110,0.18)] dark:shadow-none">
                    <img :src="getApotekImage(apotek)" class="h-[380px] w-full object-cover md:h-[440px]" />
                    <div
                        class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,89,80,0.12)_0%,rgba(6,78,59,0.45)_40%,rgba(2,44,34,0.86)_100%)]" />

                    <div class="absolute inset-x-0 top-0 p-6 md:p-8">
                        <NuxtLink to="/"
                            class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20">
                            <Icon icon="solar:arrow-left-linear" class="h-4 w-4" />
                            Kembali
                        </NuxtLink>
                    </div>

                    <div class="absolute inset-x-0 bottom-0 p-6 md:p-8">
                        <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
                            <div class="text-white">
                                <p class="text-sm uppercase tracking-[0.28em] text-emerald-50/75">
                                    Detail Apotek
                                </p>
                                <h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
                                    {{ apotek.nama }}
                                </h1>
                                <p class="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85 md:text-base">
                                    {{ apotek.alamat }}
                                </p>
                            </div>

                            <div class="rounded-[28px] border border-white/15 bg-white/12 p-5 text-white backdrop-blur">
                                <div class="flex items-center justify-between gap-3">
                                    <div>
                                        <p class="text-sm text-emerald-50/75">
                                            Status saat ini
                                        </p>
                                        <p class="mt-1 text-2xl font-semibold">
                                            {{ isOpen ? 'Sedang buka' : 'Sedang tutup' }}
                                        </p>
                                    </div>

                                    <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                        :class="isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                                        {{ isOpen ? 'Aktif melayani' : 'Di luar jam operasional' }}
                                    </span>
                                </div>

                                <a :href="`https://www.google.com/maps?q=${apotek.latitude},${apotek.longitude}`" target="_blank"
                                    class="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
                                    <Icon icon="solar:map-point-bold-duotone" class="h-5 w-5" />
                                    Buka di Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mx-auto mt-6 max-w-6xl px-4">
                <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <article v-for="item in infoCards" :key="item.label"
                        class="rounded-[28px] border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:shadow-none transition">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {{ item.label }}
                                </p>
                                <p class="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                                    {{ item.value }}
                                </p>
                            </div>

                            <div class="flex h-12 w-12 items-center justify-center rounded-2xl" :class="item.tone">
                                <Icon :icon="item.icon" class="h-6 w-6" />
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section class="mx-auto mt-6 max-w-6xl px-4">
                <div class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
                    <div class="space-y-6">
                        <div
                            class="rounded-[32px] border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:shadow-none">
                            <div class="flex items-center justify-between gap-3">
                                <div>
                                    <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
                                        Informasi Apotek
                                    </h2>
                                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Ringkasan detail yang paling sering dicari pengguna.
                                    </p>
                                </div>

                                <div class="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
                                    {{ stockSummary.total }} obat tersedia
                                </div>
                            </div>

                            <div class="mt-6 space-y-4">
                                <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-4">
                                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                        Alamat
                                    </p>
                                    <p class="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                                        {{ apotek.alamat }}
                                    </p>
                                </div>

                                <div class="grid gap-4 sm:grid-cols-2">
                                    <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/40 p-4">
                                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                            Telepon
                                        </p>
                                        <p class="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {{ apotek.phone_number || 'Belum tersedia' }}
                                        </p>
                                    </div>

                                    <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/40 p-4">
                                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                            Jam Operasional
                                        </p>
                                        <p class="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {{ formatTime(apotek.jam_buka) }} - {{ formatTime(apotek.jam_tutup) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="rounded-[32px] border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:shadow-none">
                            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
                                Deskripsi
                            </h2>
                            <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {{ apotek.deskripsi || 'Apotek ini belum menambahkan deskripsi. Kamu tetap bisa melihat lokasi, jam operasional, dan daftar obat yang tersedia di bawah.' }}
                            </p>
                        </div>

                        <div
                            class="rounded-[32px] border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:shadow-none">
                            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
                                Ringkasan Stok
                            </h2>

                            <div class="mt-5 grid grid-cols-3 gap-3">
                                <div class="rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/60 dark:border-emerald-900/40 px-4 py-5 text-center text-emerald-700 dark:text-emerald-400">
                                    <p class="text-xs uppercase tracking-[0.16em]">
                                        Aman
                                    </p>
                                    <p class="mt-2 text-2xl font-semibold">
                                        {{ stockSummary.safe }}
                                    </p>
                                </div>

                                <div class="rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100/60 dark:border-amber-900/40 px-4 py-5 text-center text-amber-700 dark:text-amber-400">
                                    <p class="text-xs uppercase tracking-[0.16em]">
                                        Rendah
                                    </p>
                                    <p class="mt-2 text-2xl font-semibold">
                                        {{ stockSummary.low }}
                                    </p>
                                </div>

                                <div class="rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 px-4 py-5 text-center text-slate-700 dark:text-slate-300">
                                    <p class="text-xs uppercase tracking-[0.16em]">
                                        Total
                                    </p>
                                    <p class="mt-2 text-2xl font-semibold">
                                        {{ stockSummary.total }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="rounded-[32px] border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:shadow-none">
                        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
                                    Daftar Obat
                                </h2>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Pilih obat yang tersedia lalu tambahkan ke keranjang.
                                </p>
                            </div>

                            <div class="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
                                {{ apotek.obats?.length || 0 }} produk
                            </div>
                        </div>

                        <div v-if="!apotek.obats || apotek.obats.length === 0"
                            class="mt-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            Belum ada obat yang ditampilkan oleh apotek ini.
                        </div>

                        <div v-else class="mt-6 space-y-4">
                            <article v-for="obat in apotek.obats" :key="obat.ID"
                                class="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 transition hover:border-emerald-200 dark:hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-800/80">
                                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <div class="flex flex-wrap items-center gap-3">
                                            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                                                {{ obat.Nama }}
                                            </h3>
                                            <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                                :class="obat.Stok <= 10 ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'">
                                                {{ obat.Stok <= 10 ? 'Stok terbatas' : 'Stok aman' }}
                                            </span>
                                        </div>

                                        <div class="mt-3 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                                            <span class="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-300">
                                                <Icon icon="solar:wallet-money-bold-duotone" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                Rp {{ obat.Harga.toLocaleString() }}
                                            </span>
                                            <span class="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-300">
                                                <Icon icon="solar:box-bold-duotone" class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                Stok {{ obat.Stok }}
                                            </span>
                                        </div>
                                    </div>

                                    <button @click="handleAddToCart(obat)"
                                        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20">
                                        <Icon icon="solar:cart-large-4-bold-duotone" class="h-5 w-5" />
                                        Tambah ke keranjang
                                    </button>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div v-else class="mx-auto max-w-3xl px-4 pb-20">
            <div class="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <Icon icon="solar:buildings-3-bold-duotone" class="h-8 w-8" />
                </div>
                <h2 class="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
                    Detail apotek belum tersedia
                </h2>
                <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Data apotek tidak bisa ditampilkan saat ini. Coba kembali beberapa saat lagi.
                </p>
            </div>
        </div>
    </div>
</template>
