<script setup lang="ts">
import { computed, ref } from 'vue'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({
    title: 'Daftar Artikel'
})

const search = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const selectedId = ref<string | null>(null)
const actionLoading = ref(false)
const syncLoading = ref(false)
const deleteLoadingId = ref<string | null>(null)
const formErrorMessage = ref('')
const pageMessage = ref('')
const pageMessageState = ref<'success' | 'error'>('success')
const thumbnailPreview = ref<string | null>(null)

const {
    artikels,
    loading,
    page: currentPage,
    totalPage,
    fetchArtikel,
    deleteArtikel,
    fetchFromNews,
    createArtikel,
    updateArtikel
} = useArtikel()

const form = ref({
    judul: '',
    konten: '',
    kategori: '',
    status: 'DRAFT',
    thumbnail: null as File | null
})

const totalArtikel = computed(() => artikels.value.length)
const publishedArtikel = computed(() =>
    artikels.value.filter(item => String(item.status || '').toUpperCase() === 'PUBLISHED').length
)
const draftArtikel = computed(() =>
    artikels.value.filter(item => String(item.status || '').toUpperCase() === 'DRAFT').length
)

const filteredData = computed(() => {
    return artikels.value.filter(item =>
        item.judul?.toLowerCase().includes(search.value.toLowerCase()) ||
        item.kategori?.toLowerCase().includes(search.value.toLowerCase())
    )
})

const formatDate = (value?: string) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

const statusBadgeClass = (status?: string) => {
    return String(status || '').toUpperCase() === 'PUBLISHED'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-amber-50 text-amber-700'
}

const clearObjectPreview = () => {
    if (thumbnailPreview.value?.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview.value)
    }
}

const resetForm = () => {
    clearObjectPreview()
    thumbnailPreview.value = null
    formErrorMessage.value = ''
    form.value = {
        judul: '',
        konten: '',
        kategori: '',
        status: 'DRAFT',
        thumbnail: null
    }
}

const openCreateModal = () => {
    isEdit.value = false
    selectedId.value = null
    resetForm()
    showModal.value = true
}

const openEditModal = (item: any) => {
    isEdit.value = true
    selectedId.value = item.id
    resetForm()
    form.value = {
        judul: item.judul || '',
        konten: item.konten || '',
        kategori: item.kategori || '',
        status: String(item.status || 'DRAFT').toUpperCase(),
        thumbnail: null
    }
    thumbnailPreview.value = item.thumbnail || item.thumbnail_url || null
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const handleFile = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
        formErrorMessage.value = 'File thumbnail harus berupa gambar.'
        target.value = ''
        return
    }

    clearObjectPreview()
    form.value.thumbnail = file
    thumbnailPreview.value = URL.createObjectURL(file)
}

const submitForm = async () => {
    try {
        actionLoading.value = true
        formErrorMessage.value = ''
        pageMessage.value = ''

        if (!form.value.judul || !form.value.konten || !form.value.kategori) {
            formErrorMessage.value = 'Lengkapi judul, konten, dan kategori dulu, ya.'
            return
        }

        if (isEdit.value && selectedId.value) {
            await updateArtikel(selectedId.value, form.value)
            pageMessageState.value = 'success'
            pageMessage.value = 'Artikel berhasil diperbarui.'
        } else {
            await createArtikel(form.value)
            pageMessageState.value = 'success'
            pageMessage.value = 'Artikel baru berhasil ditambahkan.'
        }

        closeModal()
        await fetchArtikel(currentPage.value)
    } catch (err: any) {
        formErrorMessage.value = err?.data?.message || err?.message || 'Artikel belum berhasil disimpan. Coba lagi sebentar lagi.'
    } finally {
        actionLoading.value = false
    }
}

const handleDelete = async (id: string) => {
    if (!confirm('Yakin mau hapus artikel ini?')) return

    try {
        deleteLoadingId.value = id
        await deleteArtikel(id)
        pageMessageState.value = 'success'
        pageMessage.value = 'Artikel berhasil dihapus.'
        await fetchArtikel(currentPage.value)
    } catch (err: any) {
        pageMessageState.value = 'error'
        pageMessage.value = err?.data?.message || err?.message || 'Artikel belum berhasil dihapus.'
    } finally {
        deleteLoadingId.value = null
    }
}

const handleFetchNews = async () => {
    try {
        syncLoading.value = true
        pageMessage.value = ''
        await fetchFromNews()
        await fetchArtikel()
        pageMessageState.value = 'success'
        pageMessage.value = 'Artikel dari News API berhasil disinkronkan.'
    } catch (err: any) {
        pageMessageState.value = 'error'
        pageMessage.value = err?.data?.message || err?.message || 'Sinkronisasi artikel belum berhasil.'
    } finally {
        syncLoading.value = false
    }
}

onMounted(() => {
    fetchArtikel()
})

onBeforeUnmount(() => {
    clearObjectPreview()
})
</script>

<template>
    <div class="space-y-6 pb-8">
        <section
            class="overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-[#0f766e] via-[#14967f] to-[#0e7490] px-7 py-8 text-white shadow-[0_28px_70px_rgba(15,118,110,0.22)]">
            <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
                <div>
                    <p class="text-sm uppercase tracking-[0.28em] text-emerald-50/75">
                        Kelola Artikel
                    </p>
                    <h1 class="mt-3 max-w-3xl text-3xl font-semibold leading-tight">
                        Atur artikel, draft, dan sinkronisasi berita dalam satu halaman yang lebih nyaman dipakai.
                    </h1>
                    <p class="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
                        Halaman ini dibuat supaya workflow admin terasa lebih modern, jelas, dan cepat dipakai saat menambah atau mengedit artikel.
                    </p>
                </div>

                <div class="grid gap-3 rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur sm:grid-cols-3 xl:grid-cols-1">
                    <div class="rounded-2xl bg-white/10 px-4 py-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-emerald-50/70">
                            Total Artikel
                        </p>
                        <p class="mt-2 text-lg font-semibold">
                            {{ totalArtikel }}
                        </p>
                    </div>
                    <div class="rounded-2xl bg-white/10 px-4 py-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-emerald-50/70">
                            Published
                        </p>
                        <p class="mt-2 text-lg font-semibold">
                            {{ publishedArtikel }}
                        </p>
                    </div>
                    <div class="rounded-2xl bg-white/10 px-4 py-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-emerald-50/70">
                            Draft
                        </p>
                        <p class="mt-2 text-lg font-semibold">
                            {{ draftArtikel }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <div v-if="pageMessage" class="rounded-[24px] border px-5 py-4 shadow-sm" :class="pageMessageState === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-rose-200 bg-rose-50 text-rose-800'">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="font-semibold">
                        {{ pageMessageState === 'success' ? 'Perubahan berhasil' : 'Masih ada kendala' }}
                    </p>
                    <p class="mt-1 text-sm">
                        {{ pageMessage }}
                    </p>
                </div>

                <button @click="pageMessage = ''" class="text-sm font-medium opacity-70 transition hover:opacity-100">
                    Tutup
                </button>
            </div>
        </div>

        <section
            class="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div class="w-full xl:max-w-xl">
                    <input v-model="search" type="text" placeholder="Cari judul atau kategori artikel"
                        class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                </div>

                <div class="flex flex-col gap-3 sm:flex-row">
                    <button @click="openCreateModal"
                        class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                        + Tambah Artikel
                    </button>

                    <button @click="handleFetchNews" :disabled="syncLoading"
                        class="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70">
                        {{ syncLoading ? 'Sinkronisasi...' : 'Sync News API' }}
                    </button>
                </div>
            </div>
        </section>

        <section
            class="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div class="border-b border-slate-200/80 px-6 py-5">
                <h2 class="text-lg font-semibold text-slate-900">
                    Daftar Artikel
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                    Semua artikel yang sudah masuk akan tampil di sini, lengkap dengan status dan tanggal publikasinya.
                </p>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead class="border-b border-slate-200 text-left text-slate-500">
                        <tr>
                            <th class="px-6 py-4 font-medium">Artikel</th>
                            <th class="px-6 py-4 font-medium">Kategori</th>
                            <th class="px-6 py-4 font-medium">Status</th>
                            <th class="px-6 py-4 font-medium">Publikasi</th>
                            <th class="px-6 py-4 font-medium">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="loading">
                            <td colspan="5" class="px-6 py-8 text-center text-slate-400">
                                Memuat artikel...
                            </td>
                        </tr>

                        <tr v-else-if="filteredData.length === 0">
                            <td colspan="5" class="px-6 py-8 text-center text-slate-400">
                                Belum ada artikel yang cocok dengan pencarianmu.
                            </td>
                        </tr>

                        <tr v-else v-for="item in filteredData" :key="item.id" class="border-b border-slate-100 last:border-b-0">
                            <td class="px-6 py-5">
                                <div class="max-w-md">
                                    <p class="font-semibold text-slate-900">
                                        {{ item.judul }}
                                    </p>
                                    <p class="mt-1 text-xs text-slate-400">
                                        ID: {{ item.id }}
                                    </p>
                                </div>
                            </td>

                            <td class="px-6 py-5 text-slate-600">
                                {{ item.kategori || '-' }}
                            </td>

                            <td class="px-6 py-5">
                                <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="statusBadgeClass(item.status)">
                                    {{ item.status || 'DRAFT' }}
                                </span>
                            </td>

                            <td class="px-6 py-5 text-slate-600">
                                {{ formatDate(item.created_at) }}
                            </td>

                            <td class="px-6 py-5">
                                <div class="flex flex-wrap gap-2">
                                    <button @click="openEditModal(item)"
                                        class="rounded-xl bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-amber-300">
                                        Edit
                                    </button>

                                    <button @click="handleDelete(item.id)" :disabled="deleteLoadingId === item.id"
                                        class="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70">
                                        {{ deleteLoadingId === item.id ? 'Menghapus...' : 'Hapus' }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
        <div class="w-full max-w-2xl rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-7">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70">
                        {{ isEdit ? 'Edit Artikel' : 'Tambah Artikel' }}
                    </p>
                    <h2 class="mt-2 text-2xl font-semibold text-slate-900">
                        {{ isEdit ? 'Perbarui artikel' : 'Buat artikel baru' }}
                    </h2>
                </div>

                <button @click="closeModal"
                    class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
                <div class="md:col-span-2">
                    <label class="mb-2 block text-sm font-medium text-slate-700">
                        Judul Artikel
                    </label>
                    <input v-model="form.judul" placeholder="Masukkan judul artikel"
                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700">
                        Kategori
                    </label>
                    <input v-model="form.kategori" placeholder="Contoh: Kesehatan"
                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700">
                        Status
                    </label>
                    <select v-model="form.status"
                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100">
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                </div>

                <div class="md:col-span-2">
                    <label class="mb-2 block text-sm font-medium text-slate-700">
                        Konten
                    </label>
                    <textarea v-model="form.konten" rows="7" placeholder="Tulis isi artikel di sini"
                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100"></textarea>
                </div>

                <div class="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p class="font-semibold text-slate-800">
                                Thumbnail Artikel
                            </p>
                            <p class="mt-1 text-sm text-slate-500">
                                Tambahkan thumbnail baru kalau ingin memperbarui tampilan artikel.
                            </p>
                        </div>

                        <label
                            class="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                            Pilih Gambar
                            <input type="file" accept="image/*" class="hidden" @change="handleFile" />
                        </label>
                    </div>

                    <div v-if="thumbnailPreview" class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img :src="thumbnailPreview" class="h-44 w-full object-cover" />
                    </div>
                </div>
            </div>

            <div v-if="formErrorMessage"
                class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {{ formErrorMessage }}
            </div>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button @click="closeModal"
                    class="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                    Batal
                </button>

                <button @click="submitForm" :disabled="actionLoading"
                    class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                    {{ actionLoading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Artikel' }}
                </button>
            </div>
        </div>
    </div>
</template>
