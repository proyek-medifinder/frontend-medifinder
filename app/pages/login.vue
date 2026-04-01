<template>
    <div class="min-h-screen grid lg:grid-cols-2">

        <!-- LEFT PANEL -->
        <div class="flex items-center bg-[#0f766e] text-white">
            <div class="max-w-md mx-auto px-12">

                <!-- <img src="/images/Logo_remove.png" class="h-32 mb-10" /> -->

                <h1 class="text-4xl font-bold mb-4">MediFinder</h1>

                <p class="text-white/90 leading-relaxed">
                    Platform pencarian apotek online yang membantu Anda menemukan obat,
                    konsultasi, dan layanan kesehatan dengan mudah.
                </p>

                <div class="mt-10 space-y-3 text-white/90">
                    <div>✓ Akses cepat ke apotek terdekat</div>
                    <div>✓ Konsultasi online</div>
                    <div>✓ Beli obat dari rumah</div>
                </div>

                <div class="mt-16 text-white/60 text-sm">
                    © 2026 MediFinder
                </div>

            </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="flex items-center justify-center bg-slate-50">

            <div class="w-full max-w-md px-8">

                <div class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900">
                        Sign In to Your Account
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        Masukkan detail Anda untuk masuk
                    </p>
                </div>

                <form class="space-y-4" @submit.prevent="handleLogin">

                    <input v-model="email" type="email" placeholder="Email"
                        class="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                    <div class="relative">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
                            class="w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                        <!-- Toggle Button -->
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                            <!-- Eye Icon -->
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5
           c4.477 0 8.268 2.943 9.542 7
           -1.274 4.057-5.065 7-9.542 7
           -4.477 0-8.268-2.943-9.542-7z" />
                            </svg>

                            <!-- Eye Slash Icon -->
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
                    <div @click="openForgotModal"
                        class="text-right text-sm text-gray-500 hover:text-[#0f766e] cursor-pointer transition">
                        Lupa password?
                    </div>

                    <button type="submit" :disabled="loading"
                        class="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 rounded-lg transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 hover:scale-[1.01] active:scale-95">
                        {{ loading ? 'Loading...' : 'Masuk' }}
                    </button>
                    <p v-if="errorMessage" class="text-red-500 text-sm text-center">
                        {{ errorMessage }}
                    </p>

                </form>

                <!-- <button
                    class="mt-4 w-full border py-3 rounded-lg bg-white hover:bg-gray-100 transition cursor-pointer flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95">
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303C33.62 32.657 29.215 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.061 0 5.842 1.154 7.961 3.039l5.657-5.657C34.073 6.053 29.297 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.655 16.108 19.007 13 24 13c3.061 0 5.842 1.154 7.961 3.039l5.657-5.657C34.073 6.053 29.297 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z" />
                        <path fill="#4CAF50"
                            d="M24 44c5.11 0 9.786-1.957 13.299-5.148l-6.144-5.199C29.112 35.091 26.676 36 24 36c-5.196 0-9.592-3.332-11.271-7.946l-6.522 5.025C9.454 39.556 16.227 44 24 44z" />
                        <path fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303c-.816 2.329-2.29 4.345-4.248 5.653l6.144 5.199C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    <div class="mt-4 flex justify-center">
                        <div id="google-buttonDiv"></div>
                    </div>

                    Login dengan Google
                </button> -->
                <div class="mt-4 flex justify-center">
                    <div id="google-buttonDiv" class="transition-all duration-200 hover:scale-[1.02] active:scale-95">
                    </div>
                </div>


                <div class="text-center mt-6 text-sm text-gray-500">
                    Tidak punya akun?
                    <NuxtLink to="/register" class="text-[#0f766e] font-medium">
                        <span class="text-[#0f766e] font-medium">
                            Ajukan sekarang
                        </span>
                    </NuxtLink>
                </div>

                <NuxtLink to="/" class="block text-center mt-4 text-sm text-gray-500 hover:text-gray-700">
                    ← Kembali ke Beranda
                </NuxtLink>

            </div>
        </div>

    </div>
    <!-- FORGOT PASSWORD MODAL -->
    <div v-if="forgotOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">

            <button @click="forgotOpen = false" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                ✕
            </button>

            <!-- STEP 1: INPUT EMAIL -->
            <div v-if="forgotStep === 1">
                <h2 class="text-xl font-semibold mb-4">Reset Password</h2>

                <input v-model="forgotEmail" type="email" placeholder="Masukkan email Anda"
                    class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                <button @click="handleSendForgot" :disabled="forgotLoading"
                    class="mt-4 w-full bg-[#0f766e] text-white py-3 rounded-lg hover:opacity-90 transition">
                    {{ forgotLoading ? 'Mengirim...' : 'Kirim OTP' }}
                </button>
            </div>

            <!-- STEP 2: INPUT OTP -->
            <div v-if="forgotStep === 2">
                <h2 class="text-xl font-semibold mb-4">Masukkan OTP</h2>

                <input v-model="forgotOtp" type="text" placeholder="Masukkan kode OTP"
                    class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                <button @click="handleVerifyOtp"
                    class="mt-4 w-full bg-[#0f766e] text-white py-3 rounded-lg hover:opacity-90 transition">
                    Verifikasi OTP
                </button>
            </div>

            <!-- STEP 3: INPUT PASSWORD BARU -->
            <div v-if="forgotStep === 3">
                <h2 class="text-xl font-semibold mb-4">Buat Password Baru</h2>

                <input v-model="newPassword" type="password" placeholder="Masukkan password baru"
                    class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                <button @click="handleResetPassword" :disabled="forgotLoading"
                    class="mt-4 w-full bg-[#0f766e] text-white py-3 rounded-lg hover:opacity-90 transition">
                    {{ forgotLoading ? "Memproses..." : "Reset Password" }}
                </button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

useHead({
    title: "Sign In"
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const newPassword = ref('')

const googleLoading = ref(false)
const router = useRouter()

const { login, googleLogin, user } = useAuth()

const forgotOpen = ref(false)
const forgotStep = ref(1)
const forgotEmail = ref('')
const forgotOtp = ref('')
const forgotLoading = ref(false)

const openForgotModal = () => {
    forgotOpen.value = true
    forgotStep.value = 1
    forgotEmail.value = ''
    forgotOtp.value = ''
}


const {
    sendForgotEmail,
    verifyOtp,
    resetPassword
} = useForgotPassword()


const handleSendForgot = async () => {
    try {
        forgotLoading.value = true
        await sendForgotEmail(forgotEmail.value)
        forgotStep.value = 2
    } catch (err: any) {
        alert(err?.data?.message || 'Gagal mengirim OTP')
    } finally {
        forgotLoading.value = false
    }
}

const handleVerifyOtp = async () => {
    try {
        await verifyOtp(forgotEmail.value, forgotOtp.value)
        alert("OTP valid!")
        forgotStep.value = 3
    } catch (err: any) {
        alert(err?.data?.message || "OTP salah")
    }
}

const handleResetPassword = async () => {
    try {
        forgotLoading.value = true

        await resetPassword(
            forgotOtp.value,
            newPassword.value
        )

        alert("Password berhasil direset!")
        forgotOpen.value = false

    } catch (err: any) {
        alert(err?.data?.message || "Gagal reset password")
    } finally {
        forgotLoading.value = false
    }
}

const handleLogin = async () => {
    try {
        loading.value = true
        errorMessage.value = ''

        await login(email.value, password.value)

        // 🔥 Redirect berdasarkan role
        if (user.value?.role === 'super_admin') {
            router.push('/admin')
        } else {
            router.push('/')
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

        if (user.value?.role === 'super_admin') {
            router.push('/admin')
        } else {
            router.push('/')
        }

    } catch (err: any) {
        errorMessage.value = 'Login Google gagal'
    }
}

onMounted(() => {
    const checkGoogle = setInterval(() => {

        // @ts-ignore
        if (window.google && window.google.accounts) {
            clearInterval(checkGoogle)

            // @ts-ignore
            window.google.accounts.id.initialize({
                client_id: '539021546127-kj6icorqjdrouo9n31tla5r2tcl90e7r.apps.googleusercontent.com',
                callback: handleCredentialResponse
            })

            // @ts-ignore
            window.google.accounts.id.renderButton(
                document.getElementById("google-buttonDiv"),
                {
                    theme: "outline",
                    size: "large",
                    shape: "pill",
                    text: "signin_with",
                    logo_alignment: "left",
                    width: 320
                }
            )
        }

    }, 100)
})
</script>
