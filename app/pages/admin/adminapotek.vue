<template>
    <div class="space-y-6">

        <!-- TITLE -->
        <h1 class="text-2xl font-bold text-white">
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

            <div class="border-b px-6 py-4 font-semibold text-gray-700 text-center">
                Daftar Admin
            </div>

            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-600">
                    <tr>
                        <th class="px-6 py-3 text-left">ID</th>
                        <th class="px-6 py-3 text-left">Username</th>
                        <th class="px-6 py-3 text-left">Nama Apotek</th>
                        <th class="px-6 py-3 text-left">Email</th>
                        <th class="px-6 py-3 text-left">Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="admin in paginatedAdmins" :key="admin.id" class="border-t hover:bg-gray-50">
                        <td class="px-6 py-3">{{ admin.id }}</td>
                        <td class="px-6 py-3">{{ admin.username }}</td>
                        <td class="px-6 py-3">{{ admin.apotek }}</td>
                        <td class="px-6 py-3">{{ admin.email }}</td>
                        <td class="px-6 py-3">
                            <span class="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">
                                Aktif
                            </span>
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


<script setup>
import { ref, computed } from "vue"

definePageMeta({
    layout: "admin",
})

useHead({
    title: "Admin Apotek",
})

const keyword = ref("")
const currentPage = ref(1)
const perPage = 5

const admins = ref([
    { id: 9, username: "qonita", apotek: "Apotek Test 3", email: "qonita@gmail.com" },
    { id: 8, username: "novalsantria320", apotek: "Apotek noval ardi", email: "novalsantria320@gmail.com" },
    { id: 6, username: "noval24", apotek: "Apotek Ardiansyah", email: "noval24@student.polindra.ac.id" },
    { id: 2, username: "test", apotek: "Apotek test", email: "novalardi230@gmail.com" },
    { id: 1, username: "admin1", apotek: "Apotek Sehat", email: "admin1@mail.com" },
    { id: 3, username: "admin2", apotek: "Apotek Farma", email: "admin2@mail.com" },
])

const filteredAdmins = computed(() => {
    if (!keyword.value) return admins.value

    return admins.value.filter(a =>
        a.username.toLowerCase().includes(keyword.value.toLowerCase())
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
