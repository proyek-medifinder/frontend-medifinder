<template>
    <div class="bg-gray-50 min-h-screen">

        <!-- HERO -->
        <div class="relative">
            <img src="/images/istri.png" class="w-full h-[300px] object-cover" />

            <!-- overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <!-- content -->
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 text-white">
                <NuxtLink to="/" class="text-sm opacity-80 hover:opacity-100">
                    ← Kembali
                </NuxtLink>

                <h1 class="text-3xl font-bold mt-2">
                    Apotek Sehat Sentosa
                </h1>

                <p class="text-sm opacity-80">
                    Lohbener, Indramayu
                </p>
            </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="max-w-5xl mx-auto px-4 mt-6  pb-10 space-y-6">

            <!-- STATUS + ACTION -->
            <div class="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">Status Apotek</p>
                    <span
                        class="inline-block mt-1 px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-600">
                        Buka
                    </span>
                </div>

                <a href="#" class="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-500 transition">
                    📍 Lihat Lokasi
                </a>
            </div>

            <!-- INFO GRID -->
            <div class="grid md:grid-cols-2 gap-5">

                <!-- INFORMASI -->
                <div class="bg-white rounded-2xl shadow-sm p-5">
                    <h2 class="font-semibold text-lg mb-3">Informasi</h2>

                    <div class="space-y-2 text-sm text-gray-600">
                        <p><span class="font-medium text-gray-800">Alamat:</span> Jl. Raya Lohbener No.123</p>
                        <p><span class="font-medium text-gray-800">Telepon:</span> 08123456789</p>
                        <p><span class="font-medium text-gray-800">Jam:</span> 08:00 - 22:00</p>
                    </div>
                </div>

                <!-- DESKRIPSI -->
                <div class="bg-white rounded-2xl shadow-sm p-5">
                    <h2 class="font-semibold text-lg mb-3">Deskripsi</h2>

                    <p class="text-sm text-gray-600 leading-relaxed">
                        Apotek ini menyediakan berbagai obat lengkap dengan pelayanan cepat dan terpercaya.
                        Cocok untuk kebutuhan kesehatan harian Anda.
                    </p>
                </div>
            </div>

            <!-- OBAT SECTION -->
            <div class="bg-white rounded-2xl shadow-sm p-5">

                <!-- HEADER -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <h2 class="font-semibold text-lg">Daftar Obat</h2>

                    <input type="text" placeholder="Cari obat..."
                        class="border px-3 py-2 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>

                <!-- TABLE -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">

                        <thead>
                            <tr class="text-left text-gray-500 border-b">
                                <th class="pb-3">Obat</th>
                                <th>Kategori</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="i in 5" :key="i" class="border-b hover:bg-gray-50 transition">
                                <!-- OBAT -->
                                <td class="py-3 flex items-center gap-3">
                                    <img src="/images/istri.png" class="w-10 h-10 rounded-lg object-cover" />
                                    <span class="font-medium">Paracetamol</span>
                                </td>

                                <!-- KATEGORI -->
                                <td>Obat Bebas</td>

                                <!-- HARGA -->
                                <td class="font-semibold text-gray-800">Rp10.000</td>

                                <!-- STOK -->
                                <td>50</td>

                                <!-- STATUS -->
                                <td>
                                    <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                                        Tersedia
                                    </span>
                                </td>

                                <!-- ACTION -->
                                <td>
                                    <div class="flex gap-2">
                                        <button
                                            class="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-300">
                                            Detail
                                        </button>

                                        <button
                                            class="bg-teal-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-teal-500">
                                            + Keranjang
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "Detail Apotek"
})
</script>