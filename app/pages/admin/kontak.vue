<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
    layout: "admin",
})

useHead({
    title: "Daftar Pesan Masuk"
})

/* =======================
   DATA DUMMY
======================= */

const pesan = ref([
    { id: 1, nama: "test", email: "novalsantria320@gmail.com", nohp: "98789" },
    { id: 2, nama: "andi", email: "andi@gmail.com", nohp: "08123456789" },
    { id: 3, nama: "siti", email: "siti@mail.com", nohp: "082233445566" },
    { id: 4, nama: "budi", email: "budi@mail.com", nohp: "081999888777" },
    { id: 5, nama: "rina", email: "rina@mail.com", nohp: "08999888777" },
])

/* =======================
   PAGINATION
======================= */

const currentPage = ref(1)
const perPage = 4

const totalPages = computed(() =>
    Math.ceil(pesan.value.length / perPage)
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return pesan.value.slice(start, start + perPage)
})
</script>

<template>
    <div class="p-8">

        <!-- TITLE -->
        <h1 class="text-3xl font-bold text-white mb-8">
            Data Pesan
        </h1>

        <!-- TABLE CARD -->
        <div class="bg-[#f3f4f6] rounded-2xl shadow-sm overflow-hidden">

            <!-- SUB TITLE -->
            <div class="text-center font-semibold py-4 border-b border-gray-300">
                Daftar Pesan yang Masuk
            </div>

            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-300 text-gray-700">
                    <tr>
                        <th class="px-6 py-3 text-left">ID</th>
                        <th class="px-6 py-3 text-left">Nama Pengirim</th>
                        <th class="px-6 py-3 text-left">Email</th>
                        <th class="px-6 py-3 text-left">No Hp</th>
                        <th class="px-6 py-3 text-left">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in paginatedData" :key="item.id" class="border-b border-gray-300 hover:bg-gray-50">
                        <td class="px-6 py-4">{{ item.id }}</td>
                        <td class="px-6 py-4">{{ item.nama }}</td>
                        <td class="px-6 py-4">{{ item.email }}</td>
                        <td class="px-6 py-4">{{ item.nohp }}</td>

                        <td class="px-6 py-4">
                            <button
                                class="border border-blue-500 text-blue-500 px-4 py-1.5 rounded-lg text-xs hover:bg-blue-50 transition">
                                👁 Detail
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- PAGINATION -->
            <div class="flex justify-end items-center gap-2 px-6 py-4 bg-gray-100">

                <button @click="currentPage--" :disabled="currentPage === 1"
                    class="px-3 py-1 border rounded disabled:opacity-40">
                    Prev
                </button>

                <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                    'px-3 py-1 rounded border text-sm',
                    currentPage === page
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white'
                ]">
                    {{ page }}
                </button>

                <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="px-3 py-1 border rounded disabled:opacity-40">
                    Next
                </button>

            </div>

        </div>

    </div>
</template>