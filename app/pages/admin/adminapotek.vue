<template>
    <div class="space-y-6">

        <!-- TITLE -->
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
            Data Admin Apotek
        </h1>

        <!-- SEARCH -->
        <div class="flex items-center gap-3">
            <div class="flex items-center bg-white rounded-xl px-4 py-2 shadow-sm w-80">
                <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
                    </svg></span>
                <input v-model="keyword" placeholder="Cari Admin" class="outline-none w-full" />
            </div>
        </div>

        <!-- TABLE -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div class="border-b px-6 py-4 text-center font-semibold text-slate-700">
                Daftar Admin
            </div>

            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-600">
                    <tr>
                        <th class="px-6 py-3 text-left">No</th>
                        <th class="px-6 py-3 text-left">Username</th>
                        <th class="px-6 py-3 text-left">Nama Apotek</th>
                        <th class="px-6 py-3 text-left">Email</th>
                        <th class="px-6 py-3 text-left">Status</th>
                        <th class="px-6 py-3 text-left">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="loading">
                        <td colspan="5" class="px-6 py-6 text-center text-gray-500">
                            Loading data...
                        </td>
                    </tr>

                    <!-- ERROR -->
                    <tr v-else-if="errorMessage">
                        <td colspan="5" class="px-6 py-6 text-center text-red-500">
                            {{ errorMessage }}
                        </td>
                    </tr>

                    <tr v-for="(admin, index) in paginatedAdmins" :key="admin.id" class="border-t hover:bg-slate-50">
                        <td class="px-6 py-4">
                            {{ (currentPage - 1) * perPage + index + 1 }}
                        </td>
                        <td class="px-6 py-3">{{ admin.name }}</td>
                        <td class="px-6 py-3">{{ admin.name }}</td>
                        <td class="px-6 py-3">{{ admin.email }}</td>
                        <td class="px-6 py-3">
                            <span :class="[
                                'text-xs px-3 py-1 rounded-full',
                                admin.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                            ]">
                                {{ admin.status }}
                            </span>
                        </td>

                        <td class="px-6 py-3 flex gap-2">
                            <button v-if="admin.status === 'approved'" @click="handleSuspend(admin.id)"
                                class="px-3 py-1 text-xs bg-yellow-400 rounded">
                                Suspend
                            </button>

                            <button v-else @click="handleApprove(admin.id)"
                                class="px-3 py-1 text-xs bg-emerald-500 text-white rounded">
                                Activate
                            </button>

                            <button @click="handleDelete(admin.id)"
                                class="px-3 py-1 text-xs bg-red-500 text-white rounded">
                                Hapus
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- PAGINATION -->
            <div class="flex justify-between items-center px-6 py-4 border-t">
                <span class="text-sm text-gray-500">
                    Halaman {{ currentPage }} dari {{ totalPages }}
                </span>

                <div class="flex gap-2">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-3 py-1 border rounded-md disabled:opacity-40">
                        Prev
                    </button>

                    <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                        'px-3 py-1 rounded-md',
                        currentPage === page
                            ? 'bg-emerald-600 text-white'
                            : 'border'
                    ]">
                        {{ page }}
                    </button>

                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-3 py-1 border rounded-md disabled:opacity-40">
                        Next
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

definePageMeta({
    layout: "admin",
    middleware: "admin"
})

useHead({
    title: "Admin Apotek",
})

const config = useRuntimeConfig()
const token = useCookie('auth_token')

const keyword = ref("")
const currentPage = ref(1)
const perPage = 5

const admins = ref<Admin[]>([])
const loading = ref(false)
const errorMessage = ref("")


interface Admin {
    id: string
    name: string
    email: string
    role_id: number
    status: string
    last_login_at: string | null
    created_at: string
    updated_at: string
}

interface AdminResponse {
    data: Admin[]
    meta: {
        limit: number
        page: number
        total?: number
    }
}

const fetchAdmins = async () => {
    try {
        loading.value = true
        errorMessage.value = ""

        const data = await $fetch<AdminResponse>(
            `${config.public.apiBase}/superadmin/admin`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'

                }
            }
        )

        admins.value = data.data

    } catch (err: any) {
        errorMessage.value = err?.data?.message || "Data admin belum bisa dimuat sekarang. Coba refresh sebentar lagi."
    } finally {
        loading.value = false
    }
}

const { updateStatusAdmin, deleteAdmin } = useAdminApotek()

const selected = ref<any>(null)

const handleEdit = (admin: any) => {
    selected.value = { ...admin }
}

const handleApprove = async (id: string) => {
    await updateStatusAdmin(id, 'approved')
    await fetchAdmins()
}

const handleSuspend = async (id: string) => {
    await updateStatusAdmin(id, 'suspended')
    await fetchAdmins()
}

const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus admin?")) return

    await deleteAdmin(id)
    await fetchAdmins()
}

onMounted(() => {
    fetchAdmins()
})

/* ===============================
   FILTER & PAGINATION
================================ */

const filteredAdmins = computed(() => {
    if (!keyword.value) return admins.value

    return admins.value.filter((a: any) =>
        `${a.name} ${a.email}`.toLowerCase().includes(keyword.value.toLowerCase())
    )
})

const totalPages = computed(() =>
    Math.ceil(filteredAdmins.value.length / perPage)
)

const paginatedAdmins = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredAdmins.value.slice(start, start + perPage)
})

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}
</script>
