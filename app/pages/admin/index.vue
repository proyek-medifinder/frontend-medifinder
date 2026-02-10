<template>
    <div >

        <!-- STATS -->
        <div class="grid md:grid-cols-3 gap-6 mb-6">

            <div class="bg-white p-6 rounded-2xl shadow-sm">
                <p class="text-sm text-gray-500">Total Admin</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">4</p>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm">
                <p class="text-sm text-gray-500">Total Apotek</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">4</p>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm">
                <p class="text-sm text-gray-500">Total Obat</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">3</p>
            </div>

        </div>

        <!-- TABLE / EMPTY STATE -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="font-semibold text-gray-800 mb-4">
                Menunggu Verifikasi
            </h2>

            <div class="text-gray-400 text-sm">
                Belum ada apotek yang menunggu verifikasi
            </div>
        </div>

    </div>
</template>

<script setup>
definePageMeta({
    layout: "admin",
})

useHead({
    title: "Dashboard Admin"
})
</script>
