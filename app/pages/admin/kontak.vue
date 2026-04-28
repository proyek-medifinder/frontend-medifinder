<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
    layout: "admin",
    middleware: 'admin'
})

useHead({
    title: "Daftar Pesan Masuk"
})

/* =======================
   DATA DUMMY
======================= */

const {
    pesan,
    loading,
    fetchPesan,
    fetchDetail,
    detail
} = useKontakAdmin()

onMounted(() => {
    fetchPesan()
})
/* =======================
   PAGINATION
======================= */

const currentPage = ref(1)
const perPage = 5

const totalPages = computed(() =>
    Math.ceil(pesan.value.length / perPage)
)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return pesan.value.slice(start, start + perPage)
})


const openModal = ref(false)

const openDetail = async (id: string) => {
    await fetchDetail(id)
    openModal.value = true
}
</script>

<template>
    <div v-if="openModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-[400px]">

            <h2 class="text-lg font-semibold mb-4">Detail Pesan</h2>

            <p><b>Nama:</b> {{ detail?.nama }}</p>
            <p><b>Email:</b> {{ detail?.email }}</p>
            <p><b>Subjek:</b> {{ detail?.subjek }}</p>
            <p class="mt-2"><b>Pesan:</b></p>
            <p class="text-sm text-gray-600">{{ detail?.pesan }}</p>

            <button @click="openModal = false" class="mt-4 px-4 py-2 bg-gray-200 rounded">
                Tutup
            </button>
        </div>
    </div>
    <div class="space-y-6">

        <!-- TITLE -->
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Data Pesan
        </h1>

        <!-- TABLE CARD -->
        <div
            class="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">

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
                        <th class="px-6 py-3 text-left">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in paginatedData" :key="item.id" class="border-b border-gray-300 hover:bg-gray-50">
                        <td class="px-6 py-4">{{ item.nama }}</td>
                        <td class="px-6 py-4">{{ item.email }}</td>
                        <td class="px-6 py-4">{{ item.subjek }}</td>

                        <td class="px-6 py-4">
                            <button @click="openDetail(item.id)"
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
