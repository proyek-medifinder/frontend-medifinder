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
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const { register } = useAuth()
const router = useRouter()

const handleRegister = async () => {
    try {
        errorMessage.value = ''
        successMessage.value = ''

        if (!name.value || !email.value || !password.value || !confirmPassword.value) {
            errorMessage.value = 'Lengkapi dulu nama, email, dan kata sandinya, ya.'
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email.value)) {
            errorMessage.value = 'Format emailnya belum tepat. Coba cek lagi, ya.'
            return
        }

        if (password.value.length < 6) {
            errorMessage.value = 'Kata sandi minimal 6 karakter supaya akunmu lebih aman.'
            return
        }

        if (password.value !== confirmPassword.value) {
            errorMessage.value = 'Konfirmasi kata sandinya belum sama. Coba cek lagi, ya.'
            return
        }

        loading.value = true

        await register(name.value, email.value, password.value)

        successMessage.value = 'Akun berhasil dibuat. Kamu akan diarahkan ke halaman login.'

        setTimeout(() => {
            router.push('/login')
        }, 1200)
    } catch (err: any) {
        errorMessage.value = err.message
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div
        class="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eefaf7_0%,#ffffff_44%,#fff9ef_100%)] px-4 py-6 sm:px-6 lg:px-8">
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
                        Buat Akun Baru
                    </p>
                    <h1 class="mt-5 max-w-xl text-4xl font-semibold leading-tight">
                        Mulai pakai MediFinder untuk cari apotek, obat, dan kebutuhan kesehatan dengan lebih mudah.
                    </h1>
                    <p class="mt-5 max-w-lg text-sm leading-7 text-emerald-50/85">
                        Sekali daftar, kamu bisa lanjut ke pencarian apotek terdekat, lihat detail produk, dan kelola aktivitas akunmu dengan lebih rapi.
                    </p>
                </div>

                <div class="space-y-3">
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Cari apotek dengan lebih cepat</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Akunmu membantu semua proses terasa lebih praktis.</p>
                    </div>
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Pantau kebutuhan keluarga dalam satu tempat</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Lebih mudah lanjutkan aktivitas kesehatan harianmu.</p>
                    </div>
                    <div class="rounded-2xl bg-white/12 px-4 py-4">
                        <p class="text-sm font-semibold">Masuk dan lanjut tanpa ribet</p>
                        <p class="mt-1 text-sm text-emerald-50/75">Daftar sekali, lalu gunakan seluruh layanan MediFinder.</p>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-center p-5 sm:p-8 lg:p-10">
                <div class="w-full max-w-md">
                    <div class="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
                        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f766e]/70 lg:hidden">
                            Buat Akun Baru
                        </p>
                        <h2 class="mt-3 text-3xl font-semibold text-slate-900">
                            Daftar akun MediFinder
                        </h2>
                        <p class="mt-2 text-sm leading-6 text-slate-500">
                            Isi data singkat di bawah ini untuk mulai memakai MediFinder.
                        </p>

                        <form @submit.prevent="handleRegister" class="mt-8 space-y-5">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">
                                    Nama Lengkap
                                </label>
                                <input v-model="name" type="text" placeholder="Masukkan nama lengkap"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input v-model="email" type="email" placeholder="contoh@email.com"
                                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">
                                    Kata Sandi
                                </label>
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

                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">
                                    Konfirmasi Kata Sandi
                                </label>
                                <div class="relative">
                                    <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                        placeholder="Ulangi kata sandi"
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
                            </div>

                            <div v-if="errorMessage"
                                class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {{ errorMessage }}
                            </div>

                            <div v-if="successMessage"
                                class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {{ successMessage }}
                            </div>

                            <button type="submit" :disabled="loading"
                                class="w-full rounded-2xl bg-yellow-400 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70">
                                {{ loading ? 'Sedang membuat akun...' : 'Daftar Sekarang' }}
                            </button>
                        </form>

                        <div class="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                            Sudah punya akun?
                            <NuxtLink to="/login" class="font-semibold text-[#0f766e]">
                                Masuk di sini
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
