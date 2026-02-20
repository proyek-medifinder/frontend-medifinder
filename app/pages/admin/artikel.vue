<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
    layout: "admin",
})

useHead({
    title: "Daftar Artikel"
})

/* =======================
   DATA DUMMY
======================= */

const search = ref('')

const artikels = ref([
    { id: 3, judul: "Apa Itu Paracetamol? Fungsi, Cara Kerja, dan Aturan Pakainya", tanggal: "08 Dec 2025" },
    { id: 4, judul: "Probiotik: Bagaimana Cara Kerjanya dan Apa Manfaatnya?", tanggal: "08 Dec 2025" },
    { id: 5, judul: "Manfaat Vitamin C untuk Daya Tahan Tubuh", tanggal: "09 Dec 2025" },
    { id: 6, judul: "Cara Aman Mengonsumsi Antibiotik", tanggal: "10 Dec 2025" },
])

/* =======================
   FILTER
======================= */

const filteredData = computed(() => {
    return artikels.value.filter(item =>
        item.judul.toLowerCase().includes(search.value.toLowerCase())
    )
})

/* =======================
   PAGINATION
======================= */

const currentPage = ref(1)
const perPage = 2

const totalPages = computed(() =>
    Math.ceil(filteredData.value.length / perPage)
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredData.value.slice(start, start + perPage)
})

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
    <div class="p-8">

        <!-- TITLE -->
        <h1 class="text-3xl font-bold text-white mb-6">
            Artikel
        </h1>

        <!-- SEARCH + BUTTON -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

            <div class="w-full md:max-w-xl">
                <input v-model="search" type="text" placeholder="Cari Judul Artikel"
                    class="w-full px-5 py-3 rounded-xl bg-white outline-none" />
            </div>

            <button class="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                + Tambah Artikel
            </button>

        </div>

        <!-- TABLE -->
        <div class="bg-[#f3f4f6] rounded-2xl shadow-sm overflow-hidden">

            <table class="w-full text-sm">
                <thead class="border-b border-gray-300 text-gray-700">
                    <tr>
                        <th class="px-6 py-3">No</th>
                        <th class="px-6 py-3">ID Artikel</th>
                        <th class="px-6 py-3">Judul Artikel</th>
                        <th class="px-6 py-3">Tanggal Publikasi</th>
                        <th class="px-6 py-3">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="item.id" class="border-b border-gray-300">
                        <td class="px-6 py-4">
                            {{ (currentPage - 1) * perPage + index + 1 }}
                        </td>

                        <td class="px-6 py-4">
                            {{ item.id }}
                        </td>

                        <td class="px-6 py-4">
                            {{ item.judul }}
                        </td>

                        <td class="px-6 py-4">
                            {{ item.tanggal }}
                        </td>

                        <td class="px-6 py-4 flex gap-2">
                            <button
                                class="bg-yellow-400 text-black px-3 py-1 rounded-md text-xs font-medium hover:bg-yellow-500 transition">
                                Edit
                            </button>

                            <button
                                class="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-600 transition">
                                Hapus
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- PAGINATION -->
            <div class="flex justify-between items-center px-6 py-4">

                <span class="text-sm text-gray-600">
                    Halaman {{ currentPage }} dari {{ totalPages }}
                </span>

                <div class="flex gap-2">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-3 py-1 border rounded disabled:opacity-40">
                        Prev
                    </button>

                    <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="page === currentPage
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border'" class="px-3 py-1 rounded">
                        {{ page }}
                    </button>

                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-3 py-1 border rounded disabled:opacity-40">
                        Next
                    </button>
                </div>

            </div>

        </div>

    </div>
</template>