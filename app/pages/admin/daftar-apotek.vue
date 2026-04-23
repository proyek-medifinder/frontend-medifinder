<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
    layout: "admin",
    middleware: 'admin'
})

useHead({
    title: "Daftar Apotek"
})

/* =======================
   COMPOSABLE
======================= */
const { apoteks, loading, fetchApotek } = useApotekList()

onMounted(() => {
    fetchApotek()
})

/* =======================
   SEARCH
======================= */
const search = ref('')

const filteredData = computed(() => {
    return apoteks.value.filter(item =>
        item.nama?.toLowerCase().includes(search.value.toLowerCase())
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
    <div class="space-y-6">

        <!-- TITLE -->
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Data Apotek
        </h1>

        <!-- SEARCH -->
        <div>
            <div class="relative w-80">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                </span>

                <input v-model="search" type="text" placeholder="Cari Apotek"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 outline-none" />
            </div>
        </div>

        <!-- TABLE CARD -->
        <div
            class="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">

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

                    <!-- LOADING -->
                    <tr v-if="loading">
                        <td colspan="6" class="text-center py-6 text-gray-400">
                            Loading...
                        </td>
                    </tr>

                    <!-- EMPTY -->
                    <tr v-else-if="paginatedData.length === 0">
                        <td colspan="6" class="text-center py-6 text-gray-400">
                            Data apotek kosong
                        </td>
                    </tr>

                    <!-- DATA -->
                    <tr v-else v-for="item in paginatedData" :key="item.id" class="border-t hover:bg-gray-50">

                        <td class="px-6 py-4">{{ item.id }}</td>

                        <td class="px-6 py-4">{{ item.nama }}</td>

                        <td class="px-6 py-4">{{ item.alamat }}</td>

                        <td class="px-6 py-4">{{ item.phone_number || '-' }}</td>

                        <td class="px-6 py-4">
                            <span :class="item.jam_buka ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'"
                                class="px-3 py-1 rounded-full text-xs font-semibold">
                                {{ item.jam_buka ? 'Buka' : 'Tutup' }}
                            </span>
                        </td>

                        <td class="px-6 py-4">
                            <NuxtLink :to="`/detailApotek/${item.id}`"
                                class="border border-blue-500 text-blue-500 px-4 py-1 rounded-lg text-xs hover:bg-blue-50 transition">
                                Detail
                            </NuxtLink>
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
