<template>
    <div class="min-h-screen grid lg:grid-cols-2">

        <!-- LEFT -->
        <div class="hidden lg:flex items-center bg-teal-700 text-white">
            <div class="max-w-md mx-auto px-12">
                <h1 class="text-4xl font-bold mb-6">
                    Daftarkan Apotek Anda
                </h1>

                <p class="text-white/80 leading-relaxed">
                    Bergabung dengan MediFinder dan kelola apotek Anda secara digital.
                </p>

                <div class="mt-10 space-y-3 text-white/90">
                    <div>✓ Kelola produk obat</div>
                    <div>✓ Pantau transaksi</div>
                    <div>✓ Jangkau lebih banyak pelanggan</div>
                </div>
            </div>
        </div>

        <!-- RIGHT -->
        <div class="flex items-center justify-center bg-slate-50 py-10">
            <div class="w-full max-w-5xl px-8 py-8 bg-white rounded-2xl shadow">

                <h2 class="text-2xl font-semibold text-center mb-8">
                    Pendaftaran Admin Apotek
                </h2>

                <form @submit.prevent="handleSubmit" class="grid md:grid-cols-2 gap-8">

                    <!-- LEFT -->
                    <div class="space-y-4 w-full">

                        <h3 class="text-sm font-semibold text-gray-500">Informasi Apotek</h3>

                        <input v-model="namaApotek" type="text" placeholder="Nama Apotek"
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-700" />

                        <input v-model="namaPemilik" type="text" placeholder="Nama Pemilik"
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-700" />

                        <input v-model="email" type="email" placeholder="Email"
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-700" />

                        <input v-model="noHp" type="text" placeholder="Nomor HP"
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-700" />

                        <textarea v-model="alamat" rows="3" placeholder="Alamat Lengkap"
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-700"></textarea>

                        <textarea v-model="deskripsi" rows="2" placeholder="Deskripsi Apotek"
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-700"></textarea>

                    </div>

                    <!-- RIGHT -->
                    <div class="space-y-4 w-full">

                        <h3 class="text-sm font-semibold text-gray-500">Lokasi & Keamanan</h3>

                        <!-- MAP -->
                        <div>
                            <p class="text-xs text-gray-500 mb-2">Klik map untuk menentukan lokasi</p>

                            <ClientOnly>
                                <div id="map" class="w-full h-44 rounded-lg"></div>
                            </ClientOnly>

                            <p class="text-xs text-gray-400 mt-2">
                                Lat: {{ latitude }} | Lng: {{ longitude }}
                            </p>
                        </div>

                        <!-- PASSWORD -->
                        <div class="relative">
                            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
                                class="w-full px-4 py-3 pr-10 rounded-lg border focus:ring-2 focus:ring-teal-700" />

                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5
                      c4.477 0 8.268 2.943 9.542 7
                      -1.274 4.057-5.065 7-9.542 7
                      -4.477 0-8.268-2.943-9.542-7z" />
                                </svg>

                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3l18 18" />
                                </svg>
                            </button>
                        </div>

                        <!-- CONFIRM -->
                        <div class="relative">
                            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                placeholder="Konfirmasi Password"
                                class="w-full px-4 py-3 pr-10 rounded-lg border focus:ring-2 focus:ring-teal-700" />

                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5
                      c4.477 0 8.268 2.943 9.542 7
                      -1.274 4.057-5.065 7-9.542 7
                      -4.477 0-8.268-2.943-9.542-7z" />
                                </svg>

                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3l18 18" />
                                </svg>
                            </button>
                        </div>

                        <!-- BUTTON -->
                        <button type="submit"
                            class="w-full bg-yellow-400 hover:bg-yellow-300 font-semibold py-3 rounded-lg">
                            Ajukan Pendaftaran
                        </button>

                    </div>

                </form>
                <p class="text-center text-sm mt-6 text-gray-500">
                    Sudah punya akun?
                    <NuxtLink to="/admin/login" class="text-teal-600 font-medium">
                        Masuk
                    </NuxtLink>
                </p>

            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
let L: any


definePageMeta({
    layout: 'auth'
})

useHead({
    title: 'Daftar Apotek'
})

const namaApotek = ref('')
const namaPemilik = ref('')
const email = ref('')
const noHp = ref('')
const alamat = ref('')
const deskripsi = ref('')

const password = ref('')
const confirmPassword = ref('')

const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const config = useRuntimeConfig()

let map: any = null
let marker: any = null

onMounted(async () => {
    const leaflet = await import("leaflet")
    L = leaflet.default
    map = L.map('map').setView([-6.4, 108.2], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    // 📍 DETEKSI LOKASI USER
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude

                latitude.value = lat
                longitude.value = lng

                map.setView([lat, lng], 15)

                marker = L.marker([lat, lng]).addTo(map)
            },
            (err) => {
                console.warn("Gagal ambil lokasi:", err.message)
            }
        )
    }

    // 🖱️ klik map manual
    map.on("click", (e: any) => {
        latitude.value = e.latlng.lat
        longitude.value = e.latlng.lng

        if (marker) {
            marker.setLatLng(e.latlng)
        } else {
            marker = L.marker(e.latlng).addTo(map)
        }
    })
})

const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (
        !namaApotek.value ||
        !namaPemilik.value ||
        !email.value ||
        !noHp.value ||
        !alamat.value ||
        !password.value ||
        !confirmPassword.value
    ) {
        errorMessage.value = 'Formulirnya belum lengkap. Mohon isi dulu semua data yang diperlukan.'
        return
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Konfirmasi kata sandinya belum sama. Coba periksa lagi, ya.'
        return
    }

    if (!latitude.value || !longitude.value) {
        errorMessage.value = 'Tentukan dulu lokasi apotek di peta supaya kami bisa memproses pengajuanmu.'
        return
    }

    try {
        loading.value = true

        await $fetch('/register-admin', {
            baseURL: config.public.apiBase,
            method: 'POST',
            body: {
                name: namaPemilik.value,
                email: email.value,
                password: password.value,
                nama_apotek: namaApotek.value,
                alamat: alamat.value,
                latitude: Number(latitude.value),
                longitude: Number(longitude.value),
                phone_number: noHp.value,
                deskripsi: deskripsi.value
            }
        })

        // ✅ SUCCESS ACTION
        successMessage.value = 'Pengajuan berhasil dikirim. Kamu akan diarahkan ke halaman login.'

        // ✅ RESET FORM
        namaApotek.value = ''
        namaPemilik.value = ''
        email.value = ''
        noHp.value = ''
        alamat.value = ''
        deskripsi.value = ''
        password.value = ''
        confirmPassword.value = ''
        latitude.value = null
        longitude.value = null

        // ✅ REDIRECT
        setTimeout(() => {
            navigateTo('/admin/login')
        }, 1500)

    } catch (err: any) {
        errorMessage.value = err?.data?.message || err.message || 'Pengajuan belum berhasil dikirim. Coba lagi sebentar lagi.'
    } finally {
        loading.value = false
    }
}
</script>
