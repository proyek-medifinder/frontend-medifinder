<script setup lang="ts">
import { ref, computed, watch } from 'vue'

definePageMeta({
    layout: "admin",
})

useHead({
    title: "Daftar Transaksi"
})

/* =========================
   DATA DUMMY
========================= */

const search = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const perPage = 5

const transaksi = ref([
    { id: 101, userid: 5, apotekid: 2, obat: "Paracetamol", jumlah: 2, total: 150000, status: "pending", tanggal: "2025-12-08" },
    { id: 102, userid: 3, apotekid: 1, obat: "Vitamin C", jumlah: 1, total: 275000, status: "completed", tanggal: "2025-12-09" },
    { id: 103, userid: 8, apotekid: 4, obat: "Amoxicillin", jumlah: 3, total: 99000, status: "cancelled", tanggal: "2025-12-10" },
    { id: 104, userid: 2, apotekid: 3, obat: "Bodrex", jumlah: 1, total: 45000, status: "completed", tanggal: "2025-12-11" },
    { id: 105, userid: 9, apotekid: 1, obat: "OBH Combi", jumlah: 2, total: 78000, status: "pending", tanggal: "2025-12-12" },
    { id: 106, userid: 7, apotekid: 2, obat: "Sanmol", jumlah: 4, total: 52000, status: "completed", tanggal: "2025-12-13" },
])

/* =========================
   FILTER + SORT
========================= */

const filteredData = computed(() => {
    return transaksi.value
        .filter(item =>
            item.obat.toLowerCase().includes(search.value.toLowerCase())
        )
        .filter(item =>
            statusFilter.value === 'all' ? true : item.status === statusFilter.value
        )
        .sort((a, b) =>
            new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        )
})

/* =========================
   PAGINATION
========================= */

const totalPages = computed(() =>
    Math.ceil(filteredData.value.length / perPage)
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredData.value.slice(start, start + perPage)
})

watch([search, statusFilter], () => {
    currentPage.value = 1
})

/* =========================
   STATS
========================= */

const totalTransaksi = computed(() => transaksi.value.length)

const totalPendapatan = computed(() =>
    transaksi.value.reduce((sum, t) => sum + t.total, 0)
)

const totalSelesai = computed(() =>
    transaksi.value.filter(t => t.status === 'completed').length
)
</script>

<template>
    <div class="p-8">

        <!-- TITLE -->
        <h1 class="text-3xl font-bold text-white mb-8">
            Daftar Riwayat Transaksi
        </h1>

        <!-- STATS -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl p-5 shadow-sm">
                <p class="text-sm text-gray-500">Total Transaksi</p>
                <p class="text-2xl font-bold">{{ totalTransaksi }}</p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
                <p class="text-sm text-gray-500">Total Pendapatan</p>
                <p class="text-2xl font-bold">Rp {{ totalPendapatan.toLocaleString() }}</p>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm">
                <p class="text-sm text-gray-500">Transaksi Selesai</p>
                <p class="text-2xl font-bold">{{ totalSelesai }}</p>
            </div>
        </div>

        <!-- FILTER AREA -->
        <div class="flex flex-col md:flex-row gap-4 mb-6">

            <input v-model="search" placeholder="Cari nama obat..."
                class="px-5 py-3 rounded-xl bg-white outline-none w-full md:max-w-md" />

            <select v-model="statusFilter" class="px-5 py-3 rounded-xl bg-white outline-none w-full md:w-65">
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>

        </div>

        <!-- TABLE -->
        <div class="bg-[#f3f4f6] rounded-2xl shadow-sm overflow-hidden">

            <table class="w-full text-sm">
                <thead class="border-b border-gray-300 text-gray-700">
                    <tr>
                        <th class="px-6 py-3">ID</th>
                        <th class="px-6 py-3">User ID</th>
                        <th class="px-6 py-3">Apotek ID</th>
                        <th class="px-6 py-3">Obat</th>
                        <th class="px-6 py-3">Jumlah</th>
                        <th class="px-6 py-3">Total</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3">Tanggal</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in paginatedData" :key="item.id" class="border-b border-gray-300 hover:bg-gray-50">
                        <td class="px-6 py-4">{{ item.id }}</td>
                        <td class="px-6 py-4">{{ item.userid }}</td>
                        <td class="px-6 py-4">{{ item.apotekid }}</td>
                        <td class="px-6 py-4">{{ item.obat }}</td>
                        <td class="px-6 py-4 text-center font-medium">{{ item.jumlah }}</td>
                        <td class="px-6 py-4 font-semibold">
                            Rp {{ item.total.toLocaleString() }}
                        </td>

                        <td class="px-6 py-4">
                            <span :class="{
                                'bg-yellow-200 text-yellow-800': item.status === 'pending',
                                'bg-green-200 text-green-800': item.status === 'completed',
                                'bg-red-200 text-red-800': item.status === 'cancelled'
                            }" class="px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                {{ item.status }}
                            </span>
                        </td>

                        <td class="px-6 py-4">
                            {{ item.tanggal }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- PAGINATION NUMBERS -->
            <div class="flex justify-center gap-2 py-5 bg-gray-100">
                <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                    'px-4 py-2 rounded-lg text-sm',
                    currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border'
                ]">
                    {{ page }}
                </button>
            </div>

        </div>

    </div>
</template>