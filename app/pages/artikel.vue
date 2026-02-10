<template>
    <div class="bg-slate-50 min-h-screen pb-20">

        <!-- HERO HEADER -->
        <section class="bg-white border-b pt-24 hero-item">
            <div class="max-w-6xl mx-auto px-6 py-14 text-center">
                <h1 class="text-4xl font-bold text-gray-900">
                    Artikel Kesehatan
                </h1>
                <p class="text-gray-500 mt-3">
                    Informasi kesehatan terpercaya dari MediFinder
                </p>
            </div>
        </section>


        <!-- CONTENT -->
        <div class="max-w-6xl mx-auto px-6 mt-12 artikel">

            <!-- FEATURED -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-12 grid md:grid-cols-2">

                <!-- IMAGE WRAPPER -->
                <div class="h-72 md:h-auto">
                    <img src="/images/image.png" class="w-full h-full object-cover" />
                </div>

                <div class="p-8 flex flex-col justify-center">
                    <span class="text-xs font-semibold text-[#0f766e] bg-[#0f766e]/10 px-3 py-1 rounded-full w-fit">
                        Artikel Utama
                    </span>

                    <h2 class="mt-4 text-2xl font-bold text-gray-900">
                        Apa Itu Paracetamol? Fungsi dan Aturan Pakai
                    </h2>

                    <p class="text-gray-500 mt-3 leading-relaxed">
                        Paracetamol adalah obat yang digunakan untuk meredakan nyeri ringan hingga sedang serta
                        menurunkan demam.
                    </p>

                    <button class="mt-6 bg-yellow-400 hover:bg-yellow-300 px-5 py-2 rounded-full font-semibold w-fit">
                        Baca Artikel
                    </button>
                </div>
            </div>

            <!-- SECTION TITLE -->
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
                Artikel Terbaru
            </h3>

            <!-- GRID -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="article in articles" :key="article.id"
                    class="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                    <img :src="article.image" class="w-full h-40 object-cover" />

                    <div class="p-5">
                        <span class="text-xs text-[#0f766e] font-medium">
                            {{ article.category }}
                        </span>

                        <h3 class="mt-2 font-semibold text-gray-900 leading-snug">
                            {{ article.title }}
                        </h3>

                        <p class="text-sm text-gray-500 mt-2">
                            {{ article.excerpt }}
                        </p>

                        <button class="mt-4 text-sm font-semibold text-[#0f766e] hover:underline">
                            Baca Artikel →
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useHead({
    title: "Artikel"
})

const articles = [
    {
        id: 1,
        title: "Manfaat Probiotik untuk Pencernaan",
        excerpt: "Probiotik membantu menjaga keseimbangan bakteri baik...",
        category: "Kesehatan",
        image: "/images/image.png"
    },
    {
        id: 2,
        title: "Tips Menjaga Imunitas Tubuh",
        excerpt: "Sistem imun yang kuat membantu tubuh melawan penyakit...",
        category: "Lifestyle",
        image: "/images/image.png"
    },
    {
        id: 3,
        title: "Cara Menyimpan Obat yang Benar",
        excerpt: "Penyimpanan obat yang tepat menjaga kualitas obat...",
        category: "Edukasi",
        image: "/images/image.png"
    }
]

onMounted(async () => {
    await nextTick()

    gsap.from('.hero-item', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
    })
    gsap.from('.artikel', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
    })


})
</script>
