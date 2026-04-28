<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import gsap from 'gsap'

useHead({
    title: 'Artikel'
})

const config = useRuntimeConfig()

const artikels = ref<any[]>([])
const loading = ref(false)

const featuredArticle = computed(() => artikels.value[0] || null)
const latestArticles = computed(() => artikels.value.slice(1))

const formatDate = (value?: string) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

const fetchArtikel = async () => {
    try {
        loading.value = true

        const res: any = await $fetch(`${config.public.apiBase}/artikel`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        })

        artikels.value = (res.data || []).map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.judul,
            excerpt: item.konten?.slice(0, 145) + (item.konten?.length > 145 ? '...' : ''),
            category: item.kategori || 'Artikel Kesehatan',
            image: item.image_url
                ? item.image_url.startsWith('http')
                    ? item.image_url
                    : `${config.public.apiBase}${item.image_url}`
                : '/images/istri.png',
            created_at: item.created_at
        }))
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await fetchArtikel()
    await nextTick()

    gsap.from('.artikel-hero', { opacity: 0, y: 36, duration: 0.7 })
    gsap.from('.artikel-content', { opacity: 0, y: 32, duration: 0.7, delay: 0.1 })
})
</script>

<template>
    <div class="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4fbf8_0%,#ffffff_28%,#f8fafc_100%)] pb-20 pt-24">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.12),_transparent_20%)]">
        </div>

        <section class="artikel-hero relative">
            <div class="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
                <div
                    class="overflow-hidden rounded-[34px] border border-white/70 bg-white/80 px-7 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-9 sm:py-10">
                    <div class="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
                        <div>
                            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-[#0f766e]/70">
                                Wawasan Kesehatan
                            </p>
                            <h1 class="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                                Artikel kesehatan yang terasa lebih rapi, ringan dibaca, dan mudah dijelajahi.
                            </h1>
                            <p class="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                                Temukan informasi kesehatan, obat, dan tips harian dari MediFinder dalam tampilan yang lebih modern dan nyaman dibaca.
                            </p>
                        </div>

                        <div class="grid gap-3 rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5 sm:grid-cols-3 xl:grid-cols-1">
                            <div class="rounded-2xl bg-white px-4 py-4">
                                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    Total Artikel
                                </p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">
                                    {{ artikels.length }}
                                </p>
                            </div>
                            <div class="rounded-2xl bg-white px-4 py-4">
                                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    Fokus
                                </p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">
                                    Edukasi Kesehatan
                                </p>
                            </div>
                            <div class="rounded-2xl bg-white px-4 py-4">
                                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    Update
                                </p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">
                                    Artikel Terbaru
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="artikel-content relative">
            <div class="mx-auto max-w-6xl px-6 lg:px-8">
                <div v-if="loading" class="space-y-8">
                    <div class="h-80 animate-pulse rounded-[32px] bg-white/80"></div>
                    <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        <div v-for="item in 3" :key="item" class="h-80 animate-pulse rounded-[28px] bg-white/80"></div>
                    </div>
                </div>

                <div v-else-if="featuredArticle" class="space-y-10">
                    <div
                        class="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                        <div class="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                            <div class="relative min-h-[300px] overflow-hidden">
                                <img :src="featuredArticle.image" :alt="featuredArticle.title"
                                    class="h-full w-full object-cover" />
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent"></div>
                            </div>

                            <div class="flex flex-col justify-center px-7 py-8 sm:px-9">
                                <span
                                    class="inline-flex w-fit rounded-full bg-[#0f766e]/10 px-3 py-1 text-xs font-semibold text-[#0f766e]">
                                    Artikel Utama
                                </span>

                                <p class="mt-5 text-sm font-medium text-slate-400">
                                    {{ featuredArticle.category }} • {{ formatDate(featuredArticle.created_at) }}
                                </p>

                                <h2 class="mt-3 text-3xl font-semibold leading-tight text-slate-900">
                                    {{ featuredArticle.title }}
                                </h2>

                                <p class="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                                    {{ featuredArticle.excerpt }}
                                </p>

                                <NuxtLink :to="`/detailArtikel/${featuredArticle.slug}`"
                                    class="mt-6 inline-flex w-fit items-center rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300">
                                    Baca Artikel Utama
                                </NuxtLink>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-end justify-between gap-4">
                            <div>
                                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70">
                                    Artikel Terbaru
                                </p>
                                <h3 class="mt-2 text-2xl font-semibold text-slate-900">
                                    Pilihan bacaan yang layak kamu lanjutkan
                                </h3>
                            </div>
                        </div>

                        <div v-if="latestArticles.length" class="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            <article v-for="article in latestArticles" :key="article.id"
                                class="group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                                <div class="relative overflow-hidden">
                                    <img :src="article.image" :alt="article.title"
                                        class="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                                    <div
                                        class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0f766e] shadow-sm">
                                        {{ article.category }}
                                    </div>
                                </div>

                                <div class="p-5">
                                    <p class="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                        {{ formatDate(article.created_at) }}
                                    </p>

                                    <h3 class="mt-3 text-lg font-semibold leading-snug text-slate-900">
                                        {{ article.title }}
                                    </h3>

                                    <p class="mt-3 text-sm leading-7 text-slate-500">
                                        {{ article.excerpt }}
                                    </p>

                                    <NuxtLink :to="`/detailArtikel/${article.slug}`"
                                        class="mt-5 inline-flex items-center text-sm font-semibold text-[#0f766e] transition hover:text-[#0c5f58]">
                                        Baca selengkapnya
                                    </NuxtLink>
                                </div>
                            </article>
                        </div>

                        <div v-else class="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-500">
                            Belum ada artikel tambahan yang bisa ditampilkan.
                        </div>
                    </div>
                </div>

                <div v-else class="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">
                    Artikel belum tersedia saat ini.
                </div>
            </div>
        </section>
    </div>
</template>
