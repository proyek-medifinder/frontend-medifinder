<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
    layout: "admin",
})

useHead({
    title: "Daftar Apotek"
})

/* =======================
   DATA DUMMY
======================= */

const search = ref('')

const apoteks = ref([
    { id: 11, nama: "Apotek Test 3", lokasi: "LohBener", email: "qonita@gmail.com", status: "Tutup" },
    { id: 10, nama: "Apotek Test 3", lokasi: "Lohbener", email: "novalsantria320@gmail.com", status: "Tutup" },
    { id: 6, nama: "Apotek test2", lokasi: "Lohbener Legok", email: "noval24@student.polindra.ac.id", status: "Tutup" },
    { id: 5, nama: "apotek test", lokasi: "Singajaya Legok Lohbener", email: "novalardi230@gmail.com", status: "Buka" },
    { id: 4, nama: "Apotek Sehat", lokasi: "Indramayu", email: "admin@sehat.com", status: "Buka" },
    { id: 3, nama: "Apotek Makmur", lokasi: "Jatibarang", email: "makmur@gmail.com", status: "Tutup" },
])

/* =======================
   SEARCH FILTER
======================= */

const filteredData = computed(() => {
    return apoteks.value.filter(item =>
        item.nama.toLowerCase().includes(search.value.toLowerCase())
    )
})

/* =======================
   PAGINATION
======================= */

const currentPage = ref(1)
const perPage = 4

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
            Data Apotek
        </h1>

        <!-- SEARCH -->
        <div class="mb-8">
            <div class="relative w-80">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                </span>

                <input v-model="search" type="text" placeholder="Cari Apotek"
                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-white outline-none" />
            </div>
        </div>

        <!-- TABLE CARD -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">

            <!-- TABLE TITLE -->
            <div class="border-b px-6 py-4 font-semibold text-gray-700 text-center">
                Daftar Apotek Tersedia
            </div>

            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-600">
                    <tr>
                        <th class="px-6 py-3">ID</th>
                        <th class="px-6 py-3">Nama Apotek</th>
                        <th class="px-6 py-3">Lokasi</th>
                        <th class="px-6 py-3">Email</th>
                        <th class="px-6 py-3">Status Toko</th>
                        <th class="px-6 py-3">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in paginatedData" :key="item.id" class="border-t hover:bg-gray-50">
                        <td class="px-6 py-4">{{ item.id }}</td>
                        <td class="px-6 py-4">{{ item.nama }}</td>
                        <td class="px-6 py-4">{{ item.lokasi }}</td>
                        <td class="px-6 py-4">{{ item.email }}</td>

                        <!-- STATUS -->
                        <td class="px-6 py-4">
                            <span :class="item.status === 'Buka'
                                ? 'bg-green-200 text-green-700'
                                : 'bg-red-200 text-red-700'" class="px-3 py-1 rounded-full text-xs font-semibold">
                                {{ item.status }}
                            </span>
                        </td>

                        <!-- AKSI -->
                        <td class="px-6 py-4">
                            <button
                                class="border border-blue-500 text-blue-500 px-4 py-1 rounded-lg text-xs hover:bg-blue-50 transition">
                                Detail
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- PAGINATION -->
            <div class="flex justify-between items-center px-6 py-4 border-t">

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