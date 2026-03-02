<template>
    <div class="min-h-screen grid lg:grid-cols-2">

        <!-- LEFT PANEL -->
        <div class="flex items-center bg-[#0f766e] text-white">
            <div class="max-w-md mx-auto px-12">

                <h1 class="text-4xl font-bold mb-4">
                    MediFinder Admin
                </h1>

                <p class="text-white/90 leading-relaxed">
                    Portal khusus administrator untuk mengelola data apotek,
                    transaksi, artikel, dan seluruh sistem MediFinder.
                </p>

                <div class="mt-10 space-y-3 text-white/90">
                    <div>✓ Kelola data apotek</div>
                    <div>✓ Verifikasi pendaftaran</div>
                    <div>✓ Monitoring transaksi</div>
                </div>

                <div class="mt-16 text-white/60 text-sm">
                    © 2026 MediFinder Administration Panel
                </div>

            </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="flex items-center justify-center bg-slate-50">

            <div class="w-full max-w-md px-8">

                <div class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900">
                        Admin Sign In
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        Masuk sebagai Admin Apotek atau Super Admin
                    </p>
                </div>

                <form class="space-y-4" @submit.prevent="handleLogin">

                    <input v-model="email" type="email" placeholder="Email Admin"
                        class="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#134e4a]" />

                    <div class="relative">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
                            class="w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#134e4a]" />

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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                            </svg>
                        </button>
                    </div>

                    <button type="submit" :disabled="loading"
                        class="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 rounded-lg transition cursor-pointer disabled:opacity-70">
                        {{ loading ? 'Memproses...' : 'Masuk ke Dashboard' }}
                    </button>

                    <p v-if="errorMessage" class="text-red-500 text-sm text-center">
                        {{ errorMessage }}
                    </p>

                </form>

                <!-- GOOGLE LOGIN -->
                <div class="mt-4 flex justify-center">
                    <div id="google-buttonDiv" class="transition-all duration-200 hover:scale-[1.02] active:scale-95">
                    </div>
                </div>

                <div class="text-center mt-6 text-sm text-gray-500">
                    Tidak punya akun?
                    <NuxtLink to="/admin/register-apotek" class="text-[#0f766e] font-medium">
                        <span class="text-[#0f766e] font-medium">
                            Ajukan sekarang
                        </span>
                    </NuxtLink>
                </div>


            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

useHead({
    title: "Admin Login"
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const router = useRouter()
const { login, googleLogin, user } = useAuth()

const handleLogin = async () => {
    try {
        loading.value = true
        errorMessage.value = ''

        await login(email.value, password.value)

        // 🔥 hanya admin boleh masuk
        if (
            user.value?.role === 'super_admin' ||
            user.value?.role === 'admin_apotek'
        ) {
            router.push('/admin')
        } else {
            errorMessage.value = 'Akses hanya untuk Admin'
        }

    } catch (err: any) {
        errorMessage.value = err.message
    } finally {
        loading.value = false
    }
}

import { onMounted } from 'vue'

const handleCredentialResponse = async (response: any) => {
    try {
        await googleLogin(response.credential)

        if (
            user.value?.role === 'super_admin' ||
            user.value?.role === 'admin_apotek'
        ) {
            router.push('/admin')
        } else {
            errorMessage.value = 'Akses hanya untuk Admin'
        }

    } catch {
        errorMessage.value = 'Login Google gagal'
    }
}

onMounted(() => {
    const interval = setInterval(() => {
        // @ts-ignore
        if (window.google?.accounts) {
            clearInterval(interval)

            // @ts-ignore
            window.google.accounts.id.initialize({
                client_id: '539021546127-kj6icorqjdrouo9n31tla5r2tcl90e7r.apps.googleusercontent.com',
                callback: handleCredentialResponse
            })

            // @ts-ignore
            window.google.accounts.id.renderButton(
                document.getElementById("google-buttonDiv"),
                {
                    theme: "filled_black",
                    size: "large",
                    shape: "pill",
                    text: "signin_with",
                    width: 320
                }
            )
        }
    }, 100)
})
</script>