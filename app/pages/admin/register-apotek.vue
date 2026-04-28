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
    const leaflet = await import('leaflet')
    L = leaflet.default
    map = L.map('map').setView([-6.4, 108.2], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

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
                console.warn('Gagal ambil lokasi:', err.message)
            }
        )
    }

    map.on('click', (e: any) => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    if (!emailRegex.test(email.value)) {
        errorMessage.value = 'Format emailnya belum tepat. Coba cek lagi, ya.'
        return
    }

    if (password.value.length < 6) {
        errorMessage.value = 'Kata sandi minimal 6 karakter supaya akun admin lebih aman.'
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

        successMessage.value = 'Pengajuan berhasil dikirim. Kamu akan diarahkan ke halaman login admin.'

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

<template>
    <div
        class="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eefaf7_0%,#ffffff_46%,#f7fbff_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.12),_transparent_20%)]">
        </div>

        <div
            class="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl overflow-hidden rounded-[34px] border border-white/70 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur lg:grid-cols-[0.92fr_1.08fr]">
            <div class="hidden bg-[#0f766e] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100/80">
                        Pendaftaran Mitra
                    </p>
                    <h1 class="mt-5 max-w-xl text-4xl font-semibold leading-tight">
                        Daftarkan apotekmu dan mulai kelola operasional digital bersama MediFinder.
                    </h1>
                    <p class="mt-5 max-w-lg text-sm leading-7 text-emerald-50/85">
                        Pengajuan ini akan membantu tim kami meninjau data apotek, lokasi, dan akun admin sebelum akses dashboard diberikan.
                    </p>
                </div>

                <div class="space-y-3">
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Kelola produk dan pesanan lebih rapi</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Semua kebutuhan operasional apotek bisa dipantau dalam satu panel.</p>
                    </div>
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Jangkau lebih banyak pelanggan</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Tampilkan apotekmu agar lebih mudah ditemukan di MediFinder.</p>
                    </div>
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Verifikasi lokasi lebih akurat</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Pilih titik apotek di peta supaya proses peninjauan berjalan lebih lancar.</p>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-center p-5 sm:p-8 lg:p-10">
                <div class="w-full max-w-4xl rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
                    <p class="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f766e]/70 lg:hidden">
                        Pendaftaran Mitra
                    </p>
                    <h2 class="mt-3 text-3xl font-semibold text-slate-900">
                        Ajukan pendaftaran admin apotek
                    </h2>
                    <p class="mt-2 text-sm leading-6 text-slate-500">
                        Lengkapi informasi apotek, data pemilik, dan lokasi agar tim kami bisa meninjau pengajuanmu.
                    </p>

                    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
                        <div class="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5">
                            <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        Informasi Apotek
                                    </h3>
                                    <p class="mt-2 text-sm leading-6 text-slate-500">
                                        Isi data utama apotek dan akun admin dalam satu alur yang lebih ringkas.
                                    </p>
                                </div>
                            </div>

                            <div class="mt-5 grid gap-4 md:grid-cols-2">
                                <input v-model="namaApotek" type="text" placeholder="Nama apotek"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />

                                <input v-model="namaPemilik" type="text" placeholder="Nama pemilik"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />

                                <input v-model="email" type="email" placeholder="Email admin"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />

                                <input v-model="noHp" type="text" placeholder="Nomor HP"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />

                                <div class="relative">
                                    <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                        placeholder="Kata sandi admin"
                                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />

                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700">
                                        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0a3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7c-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>

                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 3l18 18M10.584 10.587A2 2 0 0012 14a2 2 0 001.414-.586M9.363 5.365A9.466 9.466 0 0112 5c4.478 0 8.27 2.944 9.543 7a9.97 9.97 0 01-4.132 5.411M6.228 6.228C4.438 7.38 3.045 9.077 2.458 12c1.274 4.056 5.066 7 9.542 7a9.96 9.96 0 005.227-1.477" />
                                        </svg>
                                    </button>
                                </div>

                                <div class="relative">
                                    <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                        placeholder="Konfirmasi kata sandi"
                                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />

                                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700">
                                        <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0a3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7c-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>

                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 3l18 18M10.584 10.587A2 2 0 0012 14a2 2 0 001.414-.586M9.363 5.365A9.466 9.466 0 0112 5c4.478 0 8.27 2.944 9.543 7a9.97 9.97 0 01-4.132 5.411M6.228 6.228C4.438 7.38 3.045 9.077 2.458 12c1.274 4.056 5.066 7 9.542 7a9.96 9.96 0 005.227-1.477" />
                                        </svg>
                                    </button>
                                </div>

                                <textarea v-model="alamat" rows="4" placeholder="Alamat lengkap apotek"
                                    class="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100"></textarea>

                                <textarea v-model="deskripsi" rows="3" placeholder="Deskripsi singkat apotek"
                                    class="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100"></textarea>
                            </div>
                        </div>

                        <div class="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5">
                            <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Lokasi Apotek
                            </h3>

                            <p class="mt-4 text-sm leading-6 text-slate-500">
                                Klik area peta untuk menentukan lokasi apotek. Kalau browser mengizinkan, posisi saat ini akan dicoba otomatis.
                            </p>

                            <ClientOnly>
                                <div id="map" class="mt-4 h-72 w-full rounded-3xl border border-slate-200"></div>
                            </ClientOnly>

                            <div class="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-500">
                                <span class="font-medium text-slate-700">Lat:</span> {{ latitude ?? '-' }}
                                <span class="mx-2 text-slate-300">|</span>
                                <span class="font-medium text-slate-700">Lng:</span> {{ longitude ?? '-' }}
                            </div>
                        </div>

                        <div>
                            <div v-if="errorMessage"
                                class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {{ errorMessage }}
                            </div>

                            <div v-if="successMessage"
                                class="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {{ successMessage }}
                            </div>

                            <button type="submit" :disabled="loading"
                                class="mt-5 w-full rounded-2xl bg-yellow-400 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70">
                                {{ loading ? 'Sedang mengirim pengajuan...' : 'Ajukan Pendaftaran' }}
                            </button>
                        </div>
                    </form>

                    <div class="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                        Sudah punya akun admin?
                        <NuxtLink to="/admin/login" class="font-semibold text-[#0f766e]">
                            Masuk di sini
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
