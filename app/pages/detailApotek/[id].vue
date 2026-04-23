<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const apotek = ref<any>(null)
const loading = ref(true)

const fetchDetail = async () => {
    try {
        const res: any = await $fetch(
            `${config.public.apiBase}/apotek/${route.params.id}`,
            {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )

        apotek.value = res.data
    } catch (err) {
        console.error("❌ gagal ambil detail", err)
    } finally {
        loading.value = false
    }
}


const router = useRouter()
const token = useCookie<string | null>('auth_token')

const { addToCart } = useCart()
const { user } = useAuth()

const showLoginDialog = ref(false)
const selectedObat = ref<any>(null)

const handleAddToCart = (obat: any) => {
    if (!user.value) {
        selectedObat.value = obat
        showLoginDialog.value = true
        return
    }

    addToCart(obat)
}
const goLogin = () => {
    showLoginDialog.value = false

    router.push({
        path: '/login',
        query: {
            redirect: route.fullPath
        }
    })
}
onMounted(fetchDetail)

useHead({
    title: "Detail Apotek"
})
</script>

<template>
    <!-- LOGIN REQUIRED DIALOG -->
    <div v-if="showLoginDialog" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">

        <div class="bg-white w-full max-w-sm rounded-2xl p-6 text-center">

            <h2 class="text-lg font-semibold text-gray-800">
                Login Diperlukan
            </h2>

            <p class="text-sm text-gray-500 mt-2">
                Silakan login terlebih dahulu untuk menambahkan obat ke keranjang
            </p>

            <div class="flex gap-2 mt-6">

                <button @click="showLoginDialog = false"
                    class="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm">
                    Batal
                </button>

                <button @click="goLogin"
                    class="flex-1 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm">
                    Login
                </button>

            </div>

        </div>
    </div>
    <div class="bg-gray-50 min-h-screen">

        <!-- LOADING -->
        <div v-if="loading" class="text-center py-20 text-gray-400">
            Memuat data apotek...
        </div>

        <!-- CONTENT -->
        <div v-else-if="apotek">

            <!-- HERO -->
            <div class="relative">
                <img src="/images/istri.png" class="w-full h-[300px] object-cover" />

                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 text-white">
                    <NuxtLink to="/" class="text-sm opacity-80 hover:opacity-100">
                        ← Kembali
                    </NuxtLink>

                    <h1 class="text-3xl font-bold mt-2">
                        {{ apotek.nama }}
                    </h1>

                    <p class="text-sm opacity-80">
                        {{ apotek.alamat }}
                    </p>
                </div>
            </div>

            <!-- MAIN -->
            <div class="max-w-5xl mx-auto px-4 mt-6 pb-10 space-y-6">

                <!-- STATUS -->
                <div class="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-500">Status Apotek</p>

                        <span class="inline-block mt-1 px-4 py-1 rounded-full text-sm font-semibold"
                            :class="apotek.jam_buka ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                            {{ apotek.jam_buka ? 'Buka' : 'Tutup' }}
                        </span>
                    </div>

                    <!-- GOOGLE MAP -->
                    <a :href="`https://www.google.com/maps?q=${apotek.latitude},${apotek.longitude}`" target="_blank"
                        class="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-500 transition">
                        📍 Lihat Lokasi
                    </a>
                </div>

                <!-- INFO -->
                <div class="grid md:grid-cols-2 gap-5">

                    <!-- INFORMASI -->
                    <div class="bg-white rounded-2xl shadow-sm p-5">
                        <h2 class="font-semibold text-lg mb-3">Informasi</h2>

                        <div class="space-y-2 text-sm text-gray-600">
                            <p>
                                <span class="font-medium text-gray-800">Alamat:</span>
                                {{ apotek.alamat }}
                            </p>

                            <p>
                                <span class="font-medium text-gray-800">Telepon:</span>
                                {{ apotek.phone_number || '-' }}
                            </p>

                            <p>
                                <span class="font-medium text-gray-800">Jam:</span>
                                {{ apotek.jam_buka || '-' }} - {{ apotek.jam_tutup || '-' }}
                            </p>
                        </div>
                    </div>

                    <!-- DESKRIPSI -->
                    <div class="bg-white rounded-2xl shadow-sm p-5">
                        <h2 class="font-semibold text-lg mb-3">Deskripsi</h2>

                        <p class="text-sm text-gray-600 leading-relaxed">
                            {{ apotek.deskripsi || 'Tidak ada deskripsi' }}
                        </p>
                    </div>
                </div>

                <!-- OBAT -->
                <div class="bg-white rounded-2xl shadow-sm p-5">
                    <h2 class="font-semibold text-lg mb-4">
                        Daftar Obat
                    </h2>

                    <!-- EMPTY -->
                    <div v-if="!apotek.obats || apotek.obats.length === 0" class="text-center text-gray-400 py-6">
                        Belum ada obat
                    </div>

                    <!-- TABLE -->
                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead class="text-left text-gray-400 border-b">
                                <tr>
                                    <th class="px-3 py-2">Nama</th>
                                    <th class="px-3 py-2">Harga</th>
                                    <th class="px-3 py-2">Stok</th>
                                    <th class="px-3 py-2">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="obat in apotek.obats" :key="obat.ID" class="border-b hover:bg-gray-50">

                                    <!-- NAMA -->
                                    <td class="px-3 py-3 font-medium text-gray-800">
                                        {{ obat.Nama }}
                                    </td>

                                    <!-- HARGA -->
                                    <td class="px-3 py-3 text-gray-600">
                                        Rp {{ obat.Harga.toLocaleString() }}
                                    </td>

                                    <!-- STOK -->
                                    <td class="px-3 py-3">
                                        <span class="text-xs px-2 py-1 rounded-full font-medium" :class="obat.Stok <= 10
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-green-100 text-green-600'">
                                            {{ obat.Stok }}
                                        </span>
                                    </td>

                                    <!-- AKSI -->
                                    <td class="px-3 py-3">
                                        <button @click="handleAddToCart(obat)"
                                            class="bg-emerald-600 text-white px-3 py-1 rounded text-xs hover:bg-emerald-700">
                                            + Keranjang
                                        </button>
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>