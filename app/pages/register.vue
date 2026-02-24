<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

useHead({
    title: 'Daftar Akun'
})

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const confirmPassword = ref('')

const loading = ref(false)
const errorMessage = ref('')

const { register } = useAuth()
const router = useRouter()

const handleRegister = async () => {
    try {
        errorMessage.value = ''

        if (!name.value || !email.value || !password.value) {
            errorMessage.value = 'Semua field wajib diisi'
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email.value)) {
            errorMessage.value = 'Format email tidak valid'
            return
        }

        if (password.value !== confirmPassword.value) {
            errorMessage.value = 'Konfirmasi password tidak sama'
            return
        }

        loading.value = true

        await register(name.value, email.value, password.value)

        // ✅ redirect ke login setelah sukses
        router.push('/login')

    } catch (err: any) {
        errorMessage.value = err.message
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen grid lg:grid-cols-2">

        <!-- LEFT SIDE -->
        <div class="hidden lg:flex items-center justify-center bg-teal-700 text-white">
            <div class="max-w-md px-12">
                <h1 class="text-4xl font-bold mb-6">
                    Daftarkan Apotek Anda
                </h1>
                <p class="text-white/80 leading-relaxed">
                    Bergabunglah dengan MediFinder dan jangkau lebih banyak pelanggan secara online.
                </p>
            </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="flex items-center justify-center bg-gray-100">

            <div class="w-full max-w-md px-8 py-12 bg-white rounded-xl shadow-md">

                <h2 class="text-2xl font-semibold text-gray-900 text-center mb-6">
                    Daftar Apotek
                </h2>

                <form @submit.prevent="handleRegister" class="space-y-4">

                    <input v-model="name" type="text" placeholder="Nama Lengkap"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600" />

                    <input v-model="email" type="email" placeholder="Email"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600" />

                    <!-- PASSWORD -->
                    <div class="relative">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
                            class="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600" />

                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
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
                            class="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600" />

                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
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

                    <button type="submit" :disabled="loading"
                        class="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 rounded-lg transition">
                        {{ loading ? 'Loading...' : 'Daftar' }}
                    </button>

                </form>

                <p class="text-center text-sm mt-6">
                    Sudah punya akun?
                    <NuxtLink to="/login" class="text-teal-600 font-medium">
                        Masuk
                    </NuxtLink>
                </p>

            </div>

        </div>

    </div>
</template>