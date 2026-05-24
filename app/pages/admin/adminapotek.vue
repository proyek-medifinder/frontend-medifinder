<template>
    <div class="space-y-6">
        <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <p class="text-sm uppercase tracking-[0.24em] text-emerald-600/80">
                    Super Admin
                </p>
                <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    Data Admin Apotek
                </h1>
                <p class="mt-2 text-sm text-slate-500">
                    Pantau status akun admin apotek, aktivasi, dan penghapusan data dari satu tabel yang lebih rapi.
                </p>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Admin termuat
                </p>
                <p class="mt-2 text-2xl font-semibold text-slate-900">
                    {{ filteredAdmins.length }}
                </p>
            </div>
        </section>

        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="relative w-full max-w-md">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
                    </svg>
                </span>
                <input v-model="keyword" placeholder="Cari nama admin, email, atau apotek"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
            </div>
        </div>

        <div class="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div class="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h2 class="font-semibold text-slate-800">
                        Daftar Admin
                    </h2>
                    <p class="mt-1 text-sm text-slate-500">
                        Kelola aktivasi dan suspend akun admin apotek dari tabel ini.
                    </p>
                </div>

                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {{ currentPage }} / {{ totalPages }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead class="bg-slate-50 text-slate-500">
                        <tr>
                            <th class="px-6 py-4 text-left font-medium">No</th>
                            <th class="px-6 py-4 text-left font-medium">Admin</th>
                            <th class="px-6 py-4 text-left font-medium">Apotek</th>
                            <th class="px-6 py-4 text-left font-medium">Status</th>
                            <th class="px-6 py-4 text-left font-medium">Bergabung</th>
                            <th class="px-6 py-4 text-left font-medium">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="loading">
                            <td colspan="6" class="px-6 py-8 text-center text-slate-500">
                                Memuat data admin apotek...
                            </td>
                        </tr>

                        <tr v-else-if="errorMessage">
                            <td colspan="6" class="px-6 py-8 text-center text-rose-500">
                                {{ errorMessage }}
                            </td>
                        </tr>

                        <tr v-else-if="paginatedAdmins.length === 0">
                            <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                                Tidak ada admin yang cocok dengan pencarian saat ini.
                            </td>
                        </tr>

                        <tr v-for="(admin, index) in paginatedAdmins" :key="admin.id"
                            class="border-t border-slate-100 align-top transition hover:bg-slate-50/80">
                            <td class="px-6 py-4 text-slate-500">
                                {{ (currentPage - 1) * perPage + index + 1 }}
                            </td>

                            <td class="px-6 py-4">
                                <p class="font-semibold text-slate-900">
                                    {{ admin.name || '-' }}
                                </p>
                                <p class="mt-1 text-xs text-slate-500">
                                    {{ admin.email || '-' }}
                                </p>
                            </td>

                            <td class="px-6 py-4">
                                <p class="font-medium text-slate-800">
                                    {{ getAdminPharmacyName(admin) }}
                                </p>
                                <p class="mt-1 text-xs text-slate-500">
                                    ID: {{ shortId(admin.id) }}
                                </p>
                            </td>

                            <td class="px-6 py-4">
                                <span :class="[
                                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                                    normalizeStatus(admin.status) === 'approved'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                ]">
                                    {{ normalizeStatus(admin.status) === 'approved' ? 'Aktif' : 'Suspend' }}
                                </span>
                            </td>

                            <td class="px-6 py-4 text-slate-600">
                                {{ formatDate(admin.created_at) }}
                            </td>

                            <td class="px-6 py-4">
                                <div class="flex flex-wrap gap-2">
                                    <button v-if="normalizeStatus(admin.status) === 'approved'"
                                        @click="handleSuspend(admin.id)" :disabled="actionLoadingId === admin.id"
                                        class="rounded-xl bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-200 disabled:opacity-60">
                                        {{ actionLoadingId === admin.id ? 'Memproses...' : 'Suspend' }}
                                    </button>

                                    <button v-else @click="handleApprove(admin.id)" :disabled="actionLoadingId === admin.id"
                                        class="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                                        {{ actionLoadingId === admin.id ? 'Memproses...' : 'Aktifkan' }}
                                    </button>

                                    <button @click="openDeleteModal(admin)"
                                        class="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">
                                        Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex flex-col gap-3 border-t px-6 py-4 md:flex-row md:items-center md:justify-between">
                <span class="text-sm text-slate-500">
                    Halaman {{ currentPage }} dari {{ totalPages }}
                </span>

                <div class="flex flex-wrap gap-2">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">
                        Prev
                    </button>

                    <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                        'rounded-xl px-3 py-2 text-sm transition',
                        currentPage === page
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    ]">
                        {{ page }}
                    </button>

                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal && selectedAdmin" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div class="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-sm uppercase tracking-[0.2em] text-rose-500">
                            Konfirmasi Hapus
                        </p>
                        <h2 class="mt-2 text-xl font-semibold text-slate-900">
                            Hapus admin apotek ini?
                        </h2>
                        <p class="mt-2 text-sm leading-6 text-slate-500">
                            Aksi ini akan menghapus akun admin yang dipilih. Pastikan data ini memang sudah tidak diperlukan lagi.
                        </p>
                    </div>

                    <button @click="closeDeleteModal"
                        class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-200">
                        Tutup
                    </button>
                </div>

                <div class="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:grid-cols-2">
                    <div>
                        <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Nama Admin</p>
                        <p class="mt-2 font-semibold text-slate-900">{{ selectedAdmin.name || '-' }}</p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Nama Apotek</p>
                        <p class="mt-2 font-semibold text-slate-900">{{ getAdminPharmacyName(selectedAdmin) }}</p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Email</p>
                        <p class="mt-2 break-all font-medium text-slate-700">{{ selectedAdmin.email || '-' }}</p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Status</p>
                        <p class="mt-2 font-medium text-slate-700">{{ normalizeStatus(selectedAdmin.status) === 'approved' ? 'Aktif' : 'Suspend' }}</p>
                    </div>
                </div>

                <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button @click="closeDeleteModal"
                        class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                        Batal
                    </button>
                    <button @click="confirmDelete" :disabled="actionLoadingId === selectedAdmin.id"
                        class="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">
                        {{ actionLoadingId === selectedAdmin.id ? 'Menghapus...' : 'Ya, Hapus Admin' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({
    title: 'Admin Apotek'
})

const config = useRuntimeConfig()
const token = useCookie('auth_token')

const keyword = ref('')
const currentPage = ref(1)
const perPage = 5

const admins = ref<Admin[]>([])
const loading = ref(false)
const errorMessage = ref('')
const actionLoadingId = ref<string | null>(null)
const showDeleteModal = ref(false)
const selectedAdmin = ref<Admin | null>(null)

interface Admin {
    id: string
    name: string
    email: string
    role_id: number
    status: string
    last_login_at: string | null
    created_at: string
    updated_at: string
    photo_url?: string
    nama_apotek?: string
    pharmacy_name?: string
}

interface AdminResponse {
    data: Admin[]
    meta: {
        limit: number
        page: number
        total?: number
    }
}

const normalizeStatus = (value?: string | null) =>
    String(value || '')
        .trim()
        .toLowerCase()

const shortId = (value?: string | null) => {
    if (!value) return '-'
    return value.length > 12 ? `${value.slice(0, 12)}...` : value
}

const formatDate = (value?: string | null) => {
    if (!value) return '-'
    return new Date(value).toLocaleString('id-ID')
}

const getAdminPharmacyName = (admin: Partial<Admin>) =>
    admin.nama_apotek || admin.pharmacy_name || admin.name || '-'

const fetchAdmins = async () => {
    try {
        loading.value = true
        errorMessage.value = ''

        const data = await $fetch<AdminResponse>(
            `${config.public.apiBase}/superadmin/admin`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )

        admins.value = data.data || []
    } catch (err: any) {
        errorMessage.value = err?.data?.message || 'Data admin belum bisa dimuat sekarang. Coba refresh sebentar lagi.'
    } finally {
        loading.value = false
    }
}

const { updateStatusAdmin, deleteAdmin } = useAdminApotek()

const handleApprove = async (id: string) => {
    try {
        actionLoadingId.value = id
        await updateStatusAdmin(id, 'approved')
        await fetchAdmins()
    } finally {
        actionLoadingId.value = null
    }
}

const handleSuspend = async (id: string) => {
    try {
        actionLoadingId.value = id
        await updateStatusAdmin(id, 'suspended')
        await fetchAdmins()
    } finally {
        actionLoadingId.value = null
    }
}

const openDeleteModal = (admin: Admin) => {
    selectedAdmin.value = admin
    showDeleteModal.value = true
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    selectedAdmin.value = null
}

const confirmDelete = async () => {
    if (!selectedAdmin.value) return

    try {
        actionLoadingId.value = selectedAdmin.value.id
        await deleteAdmin(selectedAdmin.value.id)
        closeDeleteModal()
        await fetchAdmins()
    } finally {
        actionLoadingId.value = null
    }
}

onMounted(() => {
    fetchAdmins()
})

const filteredAdmins = computed(() => {
    if (!keyword.value) return admins.value

    const needle = keyword.value.toLowerCase()

    return admins.value.filter((admin) =>
        `${admin.name} ${admin.email} ${getAdminPharmacyName(admin)}`.toLowerCase().includes(needle)
    )
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredAdmins.value.length / perPage))
)

const paginatedAdmins = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredAdmins.value.slice(start, start + perPage)
})

watch(keyword, () => {
    currentPage.value = 1
})

watch(filteredAdmins, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
    }
})

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}
</script>
