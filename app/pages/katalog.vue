<template>
    <div class="bg-slate-50 min-h-screen pb-24">

        <!-- HERO -->
        <section class="katalog-hero pt-36 pb-8">
            <div class="max-w-6xl mx-auto px-6">
                <h1 class="text-4xl font-bold text-gray-900">
                    Katalog Obat
                </h1>
                <p class="text-gray-500 mt-2">
                    Cari nama obat untuk menemukan apotek terdekat yang menyediakan produk yang Anda butuhkan.
                </p>
            </div>
        </section>

        <!-- SEARCH -->
        <section class="search-box mt-6">
            <div class="max-w-6xl mx-auto px-6">
                <div class="bg-emerald-200/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">

                    <!-- INPUT -->
                    <input v-model="keyword" placeholder="Masukkan nama obat, contoh: Paracetamol 500mg"
                        class="flex-1 px-4 py-3 rounded-xl outline-none w-full" />

                    <!-- BUTTONS -->
                    <div class="flex gap-3 w-full sm:w-auto">
                        <button @click="searchObat"
                            class="flex-1 sm:flex-none bg-[#0f766e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#115e59] transition">
                            Tampilkan
                        </button>

                        <button @click="resetSearch"
                            class="flex-1 sm:flex-none border border-gray-400 px-6 py-3 rounded-xl text-gray-500">
                            Reset
                        </button>
                    </div>

                </div>
            </div>
        </section>


        <!-- EMPTY FEATURE STATE -->
        <section v-if="!searched" class="empty-state mt-20">
            <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h3 class="font-semibold">Cari Apotek Terdekat</h3>
                    <p class="text-sm text-gray-500 mt-2">
                        Temukan apotek yang menyediakan obat yang Anda butuhkan.
                    </p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h3 class="font-semibold">Informasi Produk</h3>
                    <p class="text-sm text-gray-500 mt-2">
                        Lihat detail obat dan ketersediaannya.
                    </p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h3 class="font-semibold">Terpercaya</h3>
                    <p class="text-sm text-gray-500 mt-2">
                        Data apotek diverifikasi oleh MediFinder.
                    </p>
                </div>

            </div>
        </section>

        <!-- RESULT -->
        <section v-if="searched" class="result-section mt-14">
            <div class="max-w-6xl mx-auto px-6">

                <p class="text-gray-600 mb-6">
                    Daftar Apotek yang menyediakan Obat :
                    <b>{{ keyword }}</b>
                </p>

                <!-- RESULT FOUND -->
                <div v-if="filteredApotek.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div v-for="item in filteredApotek" :key="item.id"
                        class="apotek-card bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden">
                        <img :src="item.image" class="w-full h-40 object-cover" />

                        <div class="p-5 text-center">
                            <h3 class="font-semibold text-lg text-gray-900">
                                {{ item.name }}
                            </h3>

                            <p class="text-sm text-gray-500 mt-1">
                                {{ item.location }}
                            </p>

                            <div class="mt-3">
                                <span class="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                                    Tutup
                                </span>
                            </div>

                            <button
                                class="mt-4 bg-yellow-400 hover:bg-yellow-300 px-5 py-2 rounded-full text-sm font-semibold shadow transition hover:scale-105">
                                Lihat Detail
                            </button>
                        </div>
                    </div>

                </div>

                <!-- NO RESULT -->
                <div v-else class="text-center py-16 text-gray-400">
                    Obat tidak ditemukan di apotek terdekat.
                </div>

            </div>
        </section>

    </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

useHead({
    title: "Katalog Obat"
})

const keyword = ref('')
const searched = ref(false)

const apotek = ref([
    {
        id: 1,
        name: "Apotek Test",
        location: "Lohbener Legok",
        image: "/images/image.png",
        obat: "paracetamol"
    },
    {
        id: 2,
        name: "Apotek Sehat",
        location: "Indramayu",
        image: "/images/image.png",
        obat: "amoxicillin"
    }
])

const filteredApotek = computed(() => {
    const key = keyword.value.trim().toLowerCase()
    if (!key) return []

    return apotek.value.filter(a =>
        a.obat.includes(key)
    )
})

const searchObat = async () => {
    searched.value = true
    await nextTick()

    gsap.from('.apotek-card', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
    })
}

const resetSearch = () => {
    keyword.value = ''
    searched.value = false
}

onMounted(() => {
    gsap.from('.katalog-hero', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out'
    })

    gsap.from('.search-box', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
    })

    gsap.from('.empty-state', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out'
    })
})
</script>
