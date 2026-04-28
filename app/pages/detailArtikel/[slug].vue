<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()

const article = ref<any>(null)
const loading = ref(false)

const articleDate = computed(() => {
    if (!article.value?.created_at) return '-'
    return new Date(article.value.created_at).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
})

const articleReadTime = computed(() => {
    const words = String(article.value?.content || '').trim().split(/\s+/).filter(Boolean).length
    if (!words) return '1 menit baca'
    return `${Math.max(1, Math.ceil(words / 180))} menit baca`
})

const fetchDetail = async () => {
    try {
        loading.value = true

        const res: any = await $fetch(
            `${config.public.apiBase}/artikel/${route.params.slug}`,
            {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )

        article.value = {
            title: res.judul,
            content: res.konten,
            image: res.image_url
                ? res.image_url.startsWith('http')
                    ? res.image_url
                    : `${config.public.apiBase}${res.image_url}`
                : '/images/istri.png',
            category: res.kategori || 'Artikel Kesehatan',
            created_at: res.created_at
        }

        useHead({
            title: res.judul || 'Detail Artikel'
        })
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchDetail()
})
</script>

<template>
    <div class="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4fbf8_0%,#ffffff_32%,#f8fafc_100%)] pb-20 pt-24">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.1),_transparent_18%)]">
        </div>

        <div class="relative mx-auto max-w-5xl px-6 lg:px-8">
            <div v-if="loading" class="space-y-6">
                <div class="h-80 animate-pulse rounded-[32px] bg-white/80"></div>
                <div class="h-72 animate-pulse rounded-[32px] bg-white/80"></div>
            </div>

            <div v-else-if="article" class="space-y-8">
                <section
                    class="overflow-hidden rounded-[34px] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
                    <div class="relative h-[320px] sm:h-[420px]">
                        <img :src="article.image" :alt="article.title" class="h-full w-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>

                        <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                            <NuxtLink to="/artikel"
                                class="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur transition hover:bg-white/20">
                                Kembali ke artikel
                            </NuxtLink>

                            <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/80">
                                <span class="rounded-full bg-white/12 px-3 py-1 font-semibold text-white">
                                    {{ article.category }}
                                </span>
                                <span>{{ articleDate }}</span>
                                <span>{{ articleReadTime }}</span>
                            </div>

                            <h1 class="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
                                {{ article.title }}
                            </h1>
                        </div>
                    </div>
                </section>

                <section class="grid gap-6 lg:grid-cols-[0.24fr_0.76fr]">
                    <aside class="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:sticky lg:top-28 lg:h-fit">
                        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#0f766e]/70">
                            Ringkasan
                        </p>

                        <div class="mt-5 space-y-4 text-sm">
                            <div class="rounded-2xl bg-slate-50 px-4 py-4">
                                <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                                    Kategori
                                </p>
                                <p class="mt-2 font-semibold text-slate-900">
                                    {{ article.category }}
                                </p>
                            </div>

                            <div class="rounded-2xl bg-slate-50 px-4 py-4">
                                <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                                    Publikasi
                                </p>
                                <p class="mt-2 font-semibold text-slate-900">
                                    {{ articleDate }}
                                </p>
                            </div>

                            <div class="rounded-2xl bg-slate-50 px-4 py-4">
                                <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
                                    Estimasi Baca
                                </p>
                                <p class="mt-2 font-semibold text-slate-900">
                                    {{ articleReadTime }}
                                </p>
                            </div>
                        </div>
                    </aside>

                    <article
                        class="rounded-[28px] border border-slate-200/80 bg-white/95 px-6 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:px-8 sm:py-9">
                        <div class="prose prose-slate max-w-none text-base leading-8 whitespace-pre-line">
                            {{ article.content }}
                        </div>
                    </article>
                </section>
            </div>

            <div v-else class="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">
                Artikel yang kamu cari belum tersedia atau tidak ditemukan.
            </div>
        </div>
    </div>
</template>
