<script setup lang="ts">
useHead({
    title: 'Profil Saya'
})

const router = useRouter()
const { user, token, ensureUser } = useAuth()
const { changePassword } = useForgotPassword()
const { transaksi, fetchTransaksi, loading: loadingTransaksi } = useTransaksi()

const loading = ref(true)
const loadingPassword = ref(false)
const showTransactionDialog = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const passwordErrorMessage = ref('')
const passwordSuccessMessage = ref('')
const showOldPassword = ref(false)
const showNewPassword = ref(false)

const initials = computed(() => {
    const source = user.value?.name || user.value?.email || 'U'

    return source
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
})

const roleLabel = computed(() => {
    if (user.value?.role === 'super_admin') return 'Super Admin'
    if (user.value?.role === 'admin_apotek') return 'Admin Apotek'
    if (user.value?.role === 'user') return 'Pengguna MediFinder'
    return 'Pengguna'
})

const roleDescription = computed(() => {
    if (user.value?.role === 'super_admin') {
        return 'Akun ini punya akses penuh untuk memantau dan mengelola seluruh sistem MediFinder.'
    }

    if (user.value?.role === 'admin_apotek') {
        return 'Akun ini terhubung ke panel apotek untuk mengelola data toko, obat, dan pesanan.'
    }

    return 'Akun ini bisa dipakai untuk mencari apotek, melihat detail produk, dan memantau kebutuhan kesehatan harian.'
})

const transactionPreview = computed(() => transaksi.value.slice(0, 3))
const hiddenTransactionCount = computed(() => Math.max(transaksi.value.length - transactionPreview.value.length, 0))

const formatCurrency = (value: number | string) => {
    const amount = Number(value || 0)
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount)
}

const passwordStatusClass = (status?: string) => {
    const normalized = String(status || '').toLowerCase()

    if (normalized.includes('paid') || normalized.includes('selesai') || normalized.includes('success')) {
        return 'bg-emerald-50 text-emerald-700'
    }

    if (normalized.includes('pending') || normalized.includes('menunggu')) {
        return 'bg-amber-50 text-amber-700'
    }

    if (normalized.includes('cancel') || normalized.includes('gagal')) {
        return 'bg-rose-50 text-rose-700'
    }

    return 'bg-slate-100 text-slate-600'
}

const handleChangePassword = async () => {
    try {
        loadingPassword.value = true
        passwordErrorMessage.value = ''
        passwordSuccessMessage.value = ''

        if (!oldPassword.value || !newPassword.value) {
            passwordErrorMessage.value = 'Isi password lama dan password baru dulu, ya.'
            return
        }

        if (newPassword.value.length < 6) {
            passwordErrorMessage.value = 'Password baru minimal 6 karakter supaya lebih aman.'
            return
        }

        await changePassword(oldPassword.value, newPassword.value)

        passwordSuccessMessage.value = 'Password berhasil diperbarui.'
        oldPassword.value = ''
        newPassword.value = ''
    } catch (err: any) {
        if (err?.data?.error === 'password lama salah') {
            passwordErrorMessage.value = 'Password lama belum sesuai. Coba cek lagi, ya.'
        } else {
            passwordErrorMessage.value = err?.data?.message || err?.message || 'Password belum berhasil diubah. Coba lagi sebentar lagi.'
        }
    } finally {
        loadingPassword.value = false
    }
}

onMounted(async () => {
    try {
        if (token.value && !user.value) {
            await ensureUser()
        }

        if (token.value) {
            await fetchTransaksi()
        }
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <section class="relative overflow-hidden bg-[linear-gradient(180deg,#f4fbf8_0%,#ffffff_35%,#f8fafc_100%)]">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.14),_transparent_22%)]">
        </div>

        <div class="relative mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:px-8 lg:pb-16 lg:pt-36">
            <div
                class="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7 lg:p-9">
                <div v-if="loading" class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div class="h-64 animate-pulse rounded-[28px] bg-slate-200"></div>
                    <div class="space-y-4">
                        <div class="h-40 animate-pulse rounded-[28px] bg-slate-200"></div>
                        <div class="h-40 animate-pulse rounded-[28px] bg-slate-200"></div>
                    </div>
                </div>

                <div v-else-if="user" class="space-y-6">
                    <div class="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                        <div class="rounded-[28px] bg-[#0f766e] p-6 text-white sm:p-8">
                            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100/80">
                                Profil Pengguna
                            </p>
                            <h1 class="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                                Semua informasi akunmu kini lebih rapi dan nyaman dibaca.
                            </h1>
                            <p class="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85 sm:text-base">
                                Lihat data akun, ubah password, dan cek ringkasan transaksi tanpa harus berpindah ke banyak halaman.
                            </p>

                            <div class="mt-8 grid gap-3 sm:grid-cols-3">
                                <div class="rounded-2xl bg-white/12 px-4 py-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-emerald-100/75">
                                        Status
                                    </p>
                                    <p class="mt-2 text-lg font-semibold">
                                        Aktif
                                    </p>
                                </div>

                                <div class="rounded-2xl bg-white/12 px-4 py-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-emerald-100/75">
                                        Role
                                    </p>
                                    <p class="mt-2 text-lg font-semibold">
                                        {{ roleLabel }}
                                    </p>
                                </div>

                                <div class="rounded-2xl bg-white/12 px-4 py-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-emerald-100/75">
                                        Transaksi
                                    </p>
                                    <p class="mt-2 text-lg font-semibold">
                                        {{ transaksi.length }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-6 sm:p-8">
                            <div class="flex items-center gap-4">
                                <div
                                    class="flex h-18 w-18 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_100%)] text-2xl font-semibold text-white shadow-lg shadow-emerald-900/10">
                                    {{ initials }}
                                </div>

                                <div>
                                    <p class="text-sm font-medium text-slate-500">
                                        Halo,
                                    </p>
                                    <h2 class="text-2xl font-semibold text-slate-900">
                                        {{ user.name || 'Pengguna MediFinder' }}
                                    </h2>
                                    <p class="mt-1 text-sm leading-6 text-slate-500">
                                        {{ roleDescription }}
                                    </p>
                                </div>
                            </div>

                            <div class="mt-6 grid gap-3 sm:grid-cols-2">
                                <div class="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:col-span-2">
                                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        Email
                                    </p>
                                    <p class="mt-2 break-all text-base font-semibold text-slate-900">
                                        {{ user.email || '-' }}
                                    </p>
                                </div>

                                <div class="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        Role
                                    </p>
                                    <p class="mt-2 text-base font-semibold text-slate-900">
                                        {{ roleLabel }}
                                    </p>
                                </div>

                                <div class="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        ID Pengguna
                                    </p>
                                    <p class="mt-2 break-all text-base font-semibold text-slate-900">
                                        {{ user.user_id || '-' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                        <div class="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-6 sm:p-8">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        Keamanan Akun
                                    </p>
                                    <h3 class="mt-2 text-2xl font-semibold text-slate-900">
                                        Ganti password
                                    </h3>
                                </div>
                            </div>

                            <p class="mt-3 text-sm leading-6 text-slate-500">
                                Gunakan password baru yang lebih aman agar akunmu tetap terlindungi.
                            </p>

                            <div class="mt-6 space-y-4">
                                <div class="relative">
                                    <input v-model="oldPassword" :type="showOldPassword ? 'text' : 'password'"
                                        placeholder="Password lama"
                                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />

                                    <button type="button" @click="showOldPassword = !showOldPassword"
                                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700">
                                        <svg v-if="!showOldPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
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
                                    <input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'"
                                        placeholder="Password baru"
                                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />

                                    <button type="button" @click="showNewPassword = !showNewPassword"
                                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700">
                                        <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
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

                                <div v-if="passwordErrorMessage"
                                    class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {{ passwordErrorMessage }}
                                </div>

                                <div v-if="passwordSuccessMessage"
                                    class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {{ passwordSuccessMessage }}
                                </div>

                                <button @click="handleChangePassword" :disabled="loadingPassword"
                                    class="w-full rounded-2xl bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c5f58] disabled:cursor-not-allowed disabled:opacity-70">
                                    {{ loadingPassword ? 'Menyimpan password...' : 'Simpan Password Baru' }}
                                </button>
                            </div>
                        </div>

                        <div class="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-6 sm:p-8">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        Transaksi Terbaru
                                    </p>
                                    <h3 class="mt-2 text-2xl font-semibold text-slate-900">
                                        Riwayat singkat aktivitasmu
                                    </h3>
                                </div>

                                <button v-if="transaksi.length > 3" @click="showTransactionDialog = true"
                                    class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f766e] shadow-sm transition hover:bg-emerald-50">
                                    Lihat semua
                                </button>
                            </div>

                            <p class="mt-3 text-sm leading-6 text-slate-500">
                                Kami tampilkan beberapa transaksi terbaru dulu supaya halaman profil tetap rapi dan mudah dibaca.
                            </p>

                            <div class="mt-6">
                                <div v-if="loadingTransaksi" class="space-y-3">
                                    <div class="h-20 animate-pulse rounded-2xl bg-slate-200"></div>
                                    <div class="h-20 animate-pulse rounded-2xl bg-slate-200"></div>
                                    <div class="h-20 animate-pulse rounded-2xl bg-slate-200"></div>
                                </div>

                                <div v-else-if="transaksi.length === 0"
                                    class="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                                    Belum ada transaksi yang tercatat di akun ini.
                                </div>

                                <div v-else class="space-y-3">
                                    <div v-for="item in transactionPreview" :key="item.id"
                                        class="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                                        <div class="flex items-start justify-between gap-4">
                                            <div>
                                                <p class="text-sm font-semibold text-slate-900">
                                                    {{ item.id }}
                                                </p>
                                                <p class="mt-1 text-sm text-slate-500">
                                                    Ringkasan transaksi terbaru dari akunmu.
                                                </p>
                                            </div>

                                            <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                                :class="passwordStatusClass(item.status)">
                                                {{ item.status }}
                                            </span>
                                        </div>

                                        <div class="mt-4 flex items-center justify-between text-sm">
                                            <p class="text-slate-500">
                                                Total pembayaran
                                            </p>
                                            <p class="font-semibold text-[#0f766e]">
                                                {{ formatCurrency(item.total) }}
                                            </p>
                                        </div>
                                    </div>

                                    <div v-if="hiddenTransactionCount > 0"
                                        class="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500">
                                        Masih ada {{ hiddenTransactionCount }} transaksi lain yang belum ditampilkan.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="rounded-[28px] border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8">
                    <div
                        class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-2xl text-amber-600">
                        !
                    </div>
                    <h2 class="mt-5 text-2xl font-semibold text-slate-900">
                        Kamu belum login
                    </h2>
                    <p class="mt-3 text-sm leading-7 text-slate-500">
                        Masuk dulu ke akun MediFinder supaya kami bisa menampilkan data profilmu di halaman ini.
                    </p>
                    <button @click="router.push('/login')"
                        class="mt-6 rounded-2xl bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c5f58]">
                        Masuk ke akun
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showTransactionDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div class="w-full max-w-3xl rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-7">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70">
                            Riwayat Lengkap
                        </p>
                        <h3 class="mt-2 text-2xl font-semibold text-slate-900">
                            Semua transaksi akunmu
                        </h3>
                    </div>

                    <button @click="showTransactionDialog = false"
                        class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mt-6 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                    <div v-for="item in transaksi" :key="item.id"
                        class="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="text-sm font-semibold text-slate-900">
                                    {{ item.id }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">
                                    Detail transaksi akun MediFinder.
                                </p>
                            </div>

                            <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                :class="passwordStatusClass(item.status)">
                                {{ item.status }}
                            </span>
                        </div>

                        <div class="mt-4 flex items-center justify-between text-sm">
                            <p class="text-slate-500">
                                Total pembayaran
                            </p>
                            <p class="font-semibold text-[#0f766e]">
                                {{ formatCurrency(item.total) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
