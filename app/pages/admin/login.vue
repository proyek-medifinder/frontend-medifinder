<script setup lang="ts">
import { onMounted } from 'vue'

definePageMeta({
    layout: 'auth'
})

useHead({
    title: 'Admin Login'
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const router = useRouter()
const { login, googleLogin, user, ensureUser } = useAuth()

const handleLogin = async () => {
    try {
        loading.value = true
        errorMessage.value = ''

        if (!email.value || !password.value) {
            errorMessage.value = 'Masukkan email admin dan kata sandi dulu, ya.'
            return
        }

        await login(email.value, password.value)

        if (
            user.value?.role === 'super_admin' ||
            user.value?.role === 'admin_apotek'
        ) {
            router.push('/admin')
        } else {
            errorMessage.value = 'Akun ini berhasil masuk, tapi belum punya akses ke panel admin.'
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
        await ensureUser()

        if (
            user.value?.role === 'super_admin' ||
            user.value?.role === 'admin_apotek'
        ) {
            router.push('/admin')
        } else {
            errorMessage.value = 'Akun Google ini belum punya akses ke panel admin.'
        }
    } catch (err: any) {
        errorMessage.value = err?.message || 'Login dengan Google belum berhasil. Coba ulang sebentar lagi.'
    }
}

const { sendForgotEmail, resendSeconds } = useForgotPassword()
const forgotOpen = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotErrorMessage = ref('')
const forgotSuccessMessage = ref('')

const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const openForgotModal = () => {
    forgotOpen.value = true
    forgotEmail.value = ''
    forgotErrorMessage.value = ''
    forgotSuccessMessage.value = ''
}

const closeForgotModal = () => {
    forgotOpen.value = false
}

const handleSendForgot = async () => {
    if (forgotLoading.value || resendSeconds.value > 0) return
    forgotEmail.value = forgotEmail.value.trim()
    try {
        forgotLoading.value = true
        forgotErrorMessage.value = ''
        forgotSuccessMessage.value = ''

        if (!forgotEmail.value) {
            forgotErrorMessage.value = 'Masukkan email admin dulu, ya.'
            return
        }

        if (!isValidEmail(forgotEmail.value)) {
            forgotErrorMessage.value = 'Format emailnya belum tepat. Coba cek lagi, ya.'
            return
        }

        const res: any = await sendForgotEmail(forgotEmail.value)

        forgotSuccessMessage.value = res.message

    } catch (err: any) {
        forgotErrorMessage.value = err?.data?.message || err?.data?.error || err?.message || 'Link reset belum berhasil dikirim. Coba lagi sebentar lagi.'
    } finally {
        forgotLoading.value = false
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
                document.getElementById('google-buttonDiv'),
                {
                    theme: 'filled_black',
                    size: 'large',
                    shape: 'pill',
                    text: 'signin_with',
                    width: 320
                }
            )
        }
    }, 100)
})
</script>

<template>
    <AppLoadingOverlay v-if="loading" label="Memproses login admin..." description="Kami sedang memverifikasi akun admin." />

    <div
        class="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#edf9f7_0%,#ffffff_46%,#f7fbff_100%)] dark:bg-[linear-gradient(135deg,#090d16_0%,#0f172a_46%,#020617_100%)] text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4 py-6 sm:px-6 lg:px-8">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.12),_transparent_20%)]">
        </div>

        <div
            class="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/70 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr] dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-none">
            <div class="hidden bg-[#0f766e] dark:bg-slate-950 dark:border-r dark:border-slate-800 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100/80 dark:text-emerald-400">
                        Admin Portal
                    </p>
                    <h1 class="mt-5 max-w-xl text-4xl font-semibold leading-tight">Kelola apotek bersama MediFinder.</h1>
                    <p class="mt-5 max-w-lg text-sm leading-7 text-emerald-50/85 dark:text-slate-300">Pantau stok, pesanan, dan verifikasi apotek.</p>
                </div>

            </div>

            <div class="flex items-center justify-center p-5 sm:p-8 lg:p-10">
                <div class="w-full max-w-md">
                    <div class="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
                        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f766e]/70 lg:hidden dark:text-emerald-400">
                            Admin Portal
                        </p>
                        <h2 class="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                            Masuk ke panel admin
                        </h2>
                        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Gunakan email dan kata sandi akun admin.</p>

                        <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                                    Email Admin
                                </label>
                                <input v-model="email" type="email" placeholder="admin@medifinder.com"
                                    class="text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-emerald-500 dark:focus:ring-emerald-950/50" />
                            </div>

                            <div>
                                <div class="mb-2 flex items-center justify-between">
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Kata Sandi
                                    </label>
                                    <button type="button" @click="openForgotModal"
                                        class="text-sm font-medium text-slate-500 transition hover:text-[#0f766e] dark:text-slate-400 dark:hover:text-emerald-300">
                                        Lupa password?
                                    </button>
                                </div>

                                <div class="relative">
                                    <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                        placeholder="Masukkan kata sandi admin"
                                        class="text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-emerald-500 dark:focus:ring-emerald-950/50" />

                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100">
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
                                class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                                {{ errorMessage }}
                            </div>

                            <button type="submit" :disabled="loading"
                                class="w-full rounded-2xl bg-yellow-400 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70">
                                {{ loading ? 'Sedang memproses...' : 'Masuk ke Dashboard' }}
                            </button>
                        </form>

                        <div class="mt-6">
                            <div id="google-buttonDiv" class="flex justify-center transition-all duration-200 hover:scale-[1.01]"></div>
                        </div>

                        <div class="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                            Belum punya akun admin apotek?
                            <NuxtLink to="/admin/register-apotek" class="font-semibold text-[#0f766e] dark:text-emerald-400">
                                Ajukan sekarang
                            </NuxtLink>
                        </div>

                        <NuxtLink to="/"
                            class="mt-5 block text-center text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200">
                            Kembali ke beranda
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="forgotOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div class="w-full max-w-md rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70 dark:text-emerald-400">
                            Admin Support
                        </p>
                        <h3 class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                            Reset password admin
                        </h3>
                    </div>

                    <button @click="closeForgotModal"
                        class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mt-6">
                    <p class="text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Masukkan email admin yang terdaftar. Nanti kami kirim link untuk atur password baru.
                    </p>

                    <input v-model="forgotEmail" type="email" autocomplete="email" aria-label="Email untuk reset password" @keyup.enter="handleSendForgot" placeholder="Masukkan email admin"
                        class="text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-emerald-500 dark:focus:ring-emerald-950/50" />
                </div>

                <div v-if="forgotErrorMessage"
                    class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                    {{ forgotErrorMessage }}
                </div>

                <div v-if="forgotSuccessMessage" role="status"
                    class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {{ forgotSuccessMessage }}
                </div>

                <button @click="handleSendForgot" :disabled="forgotLoading || resendSeconds > 0"
                    class="mt-6 w-full rounded-2xl bg-[#0f766e] py-3 text-sm font-semibold text-white transition hover:bg-[#0c5f58] disabled:cursor-not-allowed disabled:opacity-70">
                    {{ forgotLoading ? 'Memproses...' : resendSeconds > 0 ? `Kirim ulang dalam ${resendSeconds} dtk` : 'Kirim Link Reset' }}
                </button>
            </div>
        </div>
    </div>
</template>
