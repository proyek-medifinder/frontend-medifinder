<script setup lang="ts">
import { onMounted } from 'vue'

definePageMeta({
    layout: 'auth'
})

useHead({
    title: 'Sign In'
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const router = useRouter()
const { login, googleLogin, user, logout } = useAuth()

const forgotOpen = ref(false)
const forgotStep = ref(1)
const forgotEmail = ref('')
const newPassword = ref('')
const resetToken = ref('')
const forgotLoading = ref(false)
const forgotErrorMessage = ref('')
const forgotSuccessMessage = ref('')

const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const openForgotModal = () => {
    forgotOpen.value = true
    forgotStep.value = 1
    forgotEmail.value = ''
    newPassword.value = ''
    resetToken.value = ''
    forgotErrorMessage.value = ''
    forgotSuccessMessage.value = ''
}

const closeForgotModal = () => {
    forgotOpen.value = false
}

const {
    sendForgotEmail,
    resetPassword
} = useForgotPassword()

const handleSendForgot = async () => {
    try {
        forgotLoading.value = true
        forgotErrorMessage.value = ''
        forgotSuccessMessage.value = ''

        if (!forgotEmail.value) {
            forgotErrorMessage.value = 'Masukkan email kamu dulu, ya.'
            return
        }

        if (!isValidEmail(forgotEmail.value)) {
            forgotErrorMessage.value = 'Format emailnya belum tepat. Coba cek lagi, ya.'
            return
        }

        const res: any = await sendForgotEmail(forgotEmail.value)

        if (res?.token) {
            resetToken.value = res.token
            forgotStep.value = 2
        } else {
            forgotSuccessMessage.value = 'Link reset password sudah kami kirim. Coba cek email kamu, ya.'
            setTimeout(() => {
                closeForgotModal()
            }, 1200)
        }
    } catch (err: any) {
        forgotErrorMessage.value = err?.data?.message || err?.message || 'Link reset belum berhasil dikirim. Coba lagi sebentar lagi.'
    } finally {
        forgotLoading.value = false
    }
}

const handleResetPassword = async () => {
    try {
        forgotLoading.value = true
        forgotErrorMessage.value = ''
        forgotSuccessMessage.value = ''

        if (!newPassword.value) {
            forgotErrorMessage.value = 'Masukkan password baru dulu, ya.'
            return
        }

        if (newPassword.value.length < 6) {
            forgotErrorMessage.value = 'Password baru minimal 6 karakter supaya lebih aman.'
            return
        }

        await resetPassword(resetToken.value, newPassword.value)

        forgotSuccessMessage.value = 'Password berhasil diperbarui.'
        setTimeout(() => {
            closeForgotModal()
        }, 1200)
    } catch (err: any) {
        forgotErrorMessage.value = err?.data?.message || err?.message || 'Password belum berhasil direset. Coba lagi sebentar lagi.'
    } finally {
        forgotLoading.value = false
    }
}

const handleLogin = async () => {
    try {
        loading.value = true
        errorMessage.value = ''

        await login(email.value, password.value)

        if (user.value?.role === 'admin_apotek') {
            errorMessage.value = 'Akun apotek tidak bisa login di sini. Silakan gunakan halaman login apotek.'
            await logout()
            return
        }

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

const handleCredentialResponse = async (response: any) => {
    try {
        await googleLogin(response.credential)
        await nextTick()

        if (user.value?.role === 'admin_apotek') {
            errorMessage.value = 'Akun apotek tidak bisa login di sini. Silakan gunakan halaman login apotek.'
            await logout()
            return
        }

        if (user.value?.role === 'super_admin') {
            router.push('/admin')
        } else {
            router.push('/')
        }
    } catch {
        errorMessage.value = 'Login dengan Google belum berhasil. Coba lagi sebentar lagi.'
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
                document.getElementById('google-buttonDiv'),
                {
                    theme: 'outline',
                    size: 'large',
                    shape: 'pill',
                    text: 'signin_with',
                    logo_alignment: 'left',
                    width: 320
                }
            )
        }
    }, 100)
})
</script>

<template>
    <div
        class="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eefaf7_0%,#ffffff_45%,#fffaf0_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.12),_transparent_22%)]">
        </div>

        <div
            class="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/70 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
            <div class="hidden bg-[#0f766e] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
                <div>
                    <NuxtLink to="/" class="inline-flex items-center gap-3">
                        <img src="/images/Logo_remove.png" alt="MediFinder" class="h-14" />
                    </NuxtLink>

                    <p class="mt-10 text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100/80">
                        Akun MediFinder
                    </p>
                    <h1 class="mt-5 max-w-xl text-4xl font-semibold leading-tight">
                        Masuk lebih cepat untuk cari apotek, pantau pesanan, dan lanjutkan kebutuhanmu.
                    </h1>
                    <p class="mt-5 max-w-lg text-sm leading-7 text-emerald-50/85">
                        Semua akses penting ada dalam satu akun, mulai dari pencarian obat, detail apotek, sampai pesanan yang sedang berjalan.
                    </p>
                </div>

                <div class="space-y-3">
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Akses cepat ke apotek terdekat</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Lanjutkan pencarian tanpa mulai dari awal.</p>
                    </div>
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Pantau pesanan dan kebutuhan keluarga</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Semua aktivitas akun terasa lebih rapi dan mudah dipantau.</p>
                    </div>
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Satu akun untuk layanan MediFinder</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Masuk sekali, lalu lanjutkan semua kebutuhan kesehatanmu.</p>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-center p-5 sm:p-8 lg:p-10">
                <div class="w-full max-w-md">
                    <div class="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
                        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f766e]/70 lg:hidden">
                            Akun MediFinder
                        </p>
                        <h2 class="mt-3 text-3xl font-semibold text-slate-900">
                            Masuk ke akunmu
                        </h2>
                        <p class="mt-2 text-sm leading-6 text-slate-500">
                            Masukkan email dan kata sandi untuk lanjut memakai MediFinder.
                        </p>

                        <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input v-model="email" type="email" placeholder="contoh@email.com"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                            </div>

                            <div>
                                <div class="mb-2 flex items-center justify-between">
                                    <label class="block text-sm font-medium text-slate-700">
                                        Kata Sandi
                                    </label>
                                    <button type="button" @click="openForgotModal"
                                        class="text-sm font-medium text-slate-500 transition hover:text-[#0f766e]">
                                        Lupa password?
                                    </button>
                                </div>

                                <div class="relative">
                                    <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                        placeholder="Masukkan kata sandi"
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
                            </div>

                            <div v-if="errorMessage"
                                class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {{ errorMessage }}
                            </div>

                            <button type="submit" :disabled="loading"
                                class="w-full rounded-2xl bg-yellow-400 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70">
                                {{ loading ? 'Sedang memproses...' : 'Masuk ke MediFinder' }}
                            </button>
                        </form>

                        <div class="mt-6">
                            <div id="google-buttonDiv" class="flex justify-center transition-all duration-200 hover:scale-[1.01]"></div>
                        </div>

                        <div class="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                            Belum punya akun?
                            <NuxtLink to="/register" class="font-semibold text-[#0f766e]">
                                Daftar sekarang
                            </NuxtLink>
                        </div>

                        <NuxtLink to="/"
                            class="mt-5 block text-center text-sm font-medium text-slate-500 transition hover:text-slate-700">
                            Kembali ke beranda
                        </NuxtLink>

                        <p v-if="errorMessage.includes('apotek')" class="mt-3 text-center text-sm">
                            <NuxtLink to="/admin/login" class="font-semibold text-[#0f766e]">
                                Gunakan login apotek
                            </NuxtLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="forgotOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div class="w-full max-w-md rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-7">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70">
                            Bantuan Login
                        </p>
                        <h3 class="mt-2 text-2xl font-semibold text-slate-900">
                            {{ forgotStep === 1 ? 'Reset password' : 'Atur password baru' }}
                        </h3>
                    </div>

                    <button @click="closeForgotModal"
                        class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div v-if="forgotStep === 1" class="mt-6">
                    <p class="text-sm leading-6 text-slate-500">
                        Masukkan email akun kamu yang terdaftar. Kami akan kirim link untuk atur password baru.
                    </p>

                    <input v-model="forgotEmail" type="email" placeholder="Masukkan email kamu"
                        class="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                </div>

                <div v-if="forgotStep === 2" class="mt-6">
                    <p class="text-sm leading-6 text-slate-500">
                        Buat password baru yang lebih aman, lalu gunakan untuk login kembali.
                    </p>

                    <input v-model="newPassword" type="password" placeholder="Masukkan password baru"
                        class="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                </div>

                <div v-if="forgotErrorMessage"
                    class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {{ forgotErrorMessage }}
                </div>

                <div v-if="forgotSuccessMessage"
                    class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {{ forgotSuccessMessage }}
                </div>

                <button v-if="forgotStep === 1" @click="handleSendForgot" :disabled="forgotLoading"
                    class="mt-6 w-full rounded-2xl bg-[#0f766e] py-3 text-sm font-semibold text-white transition hover:bg-[#0c5f58] disabled:cursor-not-allowed disabled:opacity-70">
                    {{ forgotLoading ? 'Mengirim link reset...' : 'Kirim Link Reset' }}
                </button>

                <button v-else @click="handleResetPassword" :disabled="forgotLoading"
                    class="mt-6 w-full rounded-2xl bg-[#0f766e] py-3 text-sm font-semibold text-white transition hover:bg-[#0c5f58] disabled:cursor-not-allowed disabled:opacity-70">
                    {{ forgotLoading ? 'Menyimpan password...' : 'Simpan Password Baru' }}
                </button>
            </div>
        </div>
    </div>
</template>
