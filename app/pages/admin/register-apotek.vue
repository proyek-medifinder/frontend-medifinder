<script setup lang="ts">
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
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

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
        errorMessage.value = 'Semua field wajib diisi'
        return
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Konfirmasi password tidak sama'
        return
    }

    loading.value = true

    // 🔥 SEMENTARA (Belum ada API)
    setTimeout(() => {
        loading.value = false
        successMessage.value =
            'Pengajuan pendaftaran apotek berhasil dikirim. Menunggu verifikasi Super Admin.'
    }, 1200)
}
</script>

<template>
    <div class="min-h-screen grid lg:grid-cols-2">

        <!-- LEFT PANEL -->
        <div class="hidden lg:flex items-center bg-[#0f766e] text-white">
            <div class="max-w-md mx-auto px-12">
                <h1 class="text-4xl font-bold mb-6">
                    Daftarkan Apotek Anda
                </h1>

                <p class="text-white/80 leading-relaxed">
                    Bergabunglah sebagai mitra MediFinder dan kelola apotek Anda
                    secara digital. Tingkatkan visibilitas dan jangkauan pelanggan
                    dengan sistem modern dan terintegrasi.
                </p>

                <div class="mt-10 space-y-3 text-white/90">
                    <div>✓ Kelola produk obat</div>
                    <div>✓ Pantau transaksi</div>
                    <div>✓ Terhubung dengan pelanggan</div>
                </div>

                <div class="mt-16 text-white/60 text-sm">
                    © 2026 MediFinder Partner Program
                </div>
            </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="flex items-center justify-center bg-slate-50">
            <div class="w-full max-w-md px-8 py-12  rounded-2xl">

                <h2 class="text-2xl font-semibold text-gray-900 text-center mb-6">
                    Pendaftaran Admin Apotek
                </h2>

                <form @submit.prevent="handleSubmit" class="space-y-4">

                    <input v-model="namaApotek" type="text" placeholder="Nama Apotek"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#134e4a]" />

                    <input v-model="namaPemilik" type="text" placeholder="Nama Pemilik / Penanggung Jawab"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#134e4a]" />

                    <input v-model="email" type="email" placeholder="Email"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#134e4a]" />

                    <input v-model="noHp" type="text" placeholder="Nomor HP"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#134e4a]" />

                    <textarea v-model="alamat" rows="3" placeholder="Alamat Lengkap Apotek"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#134e4a]"></textarea>

                    <!-- PASSWORD -->
                    <div class="relative">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
                            class="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#134e4a]" />

                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer transition">
                            <!-- Eye -->
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5
           c4.477 0 8.268 2.943 9.542 7
           -1.274 4.057-5.065 7-9.542 7
           -4.477 0-8.268-2.943-9.542-7z" />
                            </svg>

                            <!-- Eye Slash -->
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19
           c-4.477 0-8.268-2.943-9.542-7
           a9.956 9.956 0 012.042-3.368m3.03-2.249A9.956
           9.956 0 0112 5c4.477 0 8.268 2.943
           9.542 7a9.978 9.978 0 01-4.043 5.143M15
           12a3 3 0 00-4.243-2.829M9.88
           9.88A3 3 0 0012 15a3 3 0 002.121-.879M3
           3l18 18" />
                            </svg>
                        </button>
                    </div>

                    <!-- CONFIRM PASSWORD -->
                    <div class="relative">
                        <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                            placeholder="Konfirmasi Password"
                            class="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#134e4a]" />

                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer transition">
                            <!-- Eye -->
                            <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5
           c4.477 0 8.268 2.943 9.542 7
           -1.274 4.057-5.065 7-9.542 7
           -4.477 0-8.268-2.943-9.542-7z" />
                            </svg>

                            <!-- Eye Slash -->
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19
           c-4.477 0-8.268-2.943-9.542-7
           a9.956 9.956 0 012.042-3.368m3.03-2.249A9.956
           9.956 0 0112 5c4.477 0 8.268 2.943
           9.542 7a9.978 9.978 0 01-4.043 5.143M15
           12a3 3 0 00-4.243-2.829M9.88
           9.88A3 3 0 0012 15a3 3 0 002.121-.879M3
           3l18 18" />
                            </svg>
                        </button>
                    </div>

                    <p v-if="errorMessage" class="text-red-500 text-sm text-center">
                        {{ errorMessage }}
                    </p>

                    <p v-if="successMessage" class="text-green-600 text-sm text-center">
                        {{ successMessage }}
                    </p>

                    <button type="submit" :disabled="loading"
                        class="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 rounded-lg transition disabled:opacity-70">
                        {{ loading ? 'Mengirim...' : 'Ajukan Pendaftaran' }}
                    </button>

                </form>

                <p class="text-center text-sm mt-6 text-gray-500">
                    Sudah terdaftar?
                    <NuxtLink to="/admin/login" class="text-[#0f766e] font-medium">
                        Masuk sebagai Admin
                    </NuxtLink>
                </p>

            </div>
        </div>

    </div>
</template>