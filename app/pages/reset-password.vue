<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

useHead({
    title: 'Reset Password'
})

const route = useRoute()
const router = useRouter()

const token = route.query.token as string

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const { resetPassword } = useForgotPassword()

const handleReset = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    try {
        loading.value = true

        if (!token) {
            errorMessage.value = 'Link reset password ini sudah tidak valid atau sudah kedaluwarsa.'
            return
        }

        if (!newPassword.value || !confirmPassword.value) {
            errorMessage.value = 'Isi dulu password baru dan konfirmasinya, ya.'
            return
        }

        if (newPassword.value.length < 6) {
            errorMessage.value = 'Password baru minimal 6 karakter supaya lebih aman.'
            return
        }

        if (newPassword.value !== confirmPassword.value) {
            errorMessage.value = 'Konfirmasi password belum sama. Coba cek lagi, ya.'
            return
        }

        await resetPassword(token, newPassword.value)

        successMessage.value = 'Password berhasil diperbarui. Kamu akan diarahkan ke halaman login.'

        setTimeout(() => {
            router.push('/login')
        }, 1400)
    } catch (err: any) {
        errorMessage.value = err?.data?.message || 'Password belum berhasil direset. Coba lagi sebentar lagi.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div
        class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#eaf8f4_0%,#ffffff_45%,#f9fafb_100%)] px-4 py-10">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.12),_transparent_22%)]">
        </div>

        <div class="relative grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/60 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur lg:grid-cols-[1fr_0.95fr]">
            <div class="hidden bg-[#0f766e] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100/80">
                        Reset Password
                    </p>
                    <h1 class="mt-6 text-4xl font-semibold leading-tight">
                        Yuk, buat password baru yang lebih aman dan mudah kamu ingat.
                    </h1>
                    <p class="mt-5 max-w-md text-sm leading-7 text-emerald-50/85">
                        Setelah password diperbarui, kamu bisa langsung kembali login dan lanjut memakai MediFinder seperti biasa.
                    </p>
                </div>

                <div class="space-y-3 text-sm text-emerald-50/85">
                    <div class="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                        <span class="text-lg">•</span>
                        Password baru minimal 6 karakter
                    </div>
                    <div class="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                        <span class="text-lg">•</span>
                        Pastikan konfirmasi password sama persis
                    </div>
                    <div class="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                        <span class="text-lg">•</span>
                        Setelah sukses, kamu akan diarahkan ke login
                    </div>
                </div>
            </div>

            <div class="p-6 sm:p-8 lg:p-10">
                <div class="mx-auto w-full max-w-md">
                    <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70 lg:hidden">
                        Reset Password
                    </p>
                    <h2 class="mt-3 text-3xl font-semibold text-slate-900">
                        Atur password baru
                    </h2>
                    <p class="mt-2 text-sm leading-6 text-slate-500">
                        Masukkan password baru yang ingin kamu gunakan untuk akun MediFinder.
                    </p>

                    <div v-if="errorMessage"
                        class="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {{ errorMessage }}
                    </div>

                    <div v-if="successMessage"
                        class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {{ successMessage }}
                    </div>

                    <div class="mt-8 space-y-5">
                        <div>
                            <label class="mb-2 block text-sm font-medium text-slate-700">
                                Password Baru
                            </label>
                            <div class="relative">
                                <input v-model="newPassword" :type="showPassword ? 'text' : 'password'"
                                    placeholder="Masukkan password baru"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700">
                                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
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

                        <div>
                            <label class="mb-2 block text-sm font-medium text-slate-700">
                                Konfirmasi Password Baru
                            </label>
                            <div class="relative">
                                <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                    placeholder="Ulangi password baru"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                    class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700">
                                    <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
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

                        <button @click="handleReset" :disabled="loading"
                            class="w-full rounded-2xl bg-yellow-400 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300 disabled:opacity-70">
                            <span v-if="loading">Memproses reset password...</span>
                            <span v-else>Simpan Password Baru</span>
                        </button>

                        <NuxtLink to="/login"
                            class="block text-center text-sm font-medium text-[#0f766e] transition hover:text-[#0c5f58]">
                            Kembali ke halaman login
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
