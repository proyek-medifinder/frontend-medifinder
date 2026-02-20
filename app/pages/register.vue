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
const confirmPassword = ref('')

const loading = ref(false)
const errorMessage = ref('')

const { register } = useAuth()
const router = useRouter()

const handleRegister = async () => {
    try {
        errorMessage.value = ''

        if (password.value !== confirmPassword.value) {
            errorMessage.value = 'Konfirmasi password tidak sama'
            return
        }

        loading.value = true

        await register(name.value, email.value, password.value)

        router.push('/')
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

                    <input v-model="password" type="password" placeholder="Password"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600" />

                    <input v-model="confirmPassword" type="password" placeholder="Konfirmasi Password"
                        class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600" />

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