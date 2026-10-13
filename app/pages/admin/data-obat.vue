<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({
    title: 'Data Obat'
})

const { medicines, fetchObat, loading, createObat, updateObat, deleteObat } = useObat()

onMounted(() => {
    fetchObat()
})

/* =======================
   STATE MODAL
======================= */
const showModal = ref(false)
const isEdit = ref(false)
const selectedId = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const submitting = ref(false)

const form = reactive({
    nama: '',
    harga: 0,
    stok: 0,
    deskripsi: '',
    image_url: ''
})

/* =======================
   STATUS
======================= */
const getStatus = (stok: number) => {
    if (stok <= 10) return { label: "Kritis", class: "bg-rose-50 text-rose-700" }
    if (stok <= 30) return { label: "Rendah", class: "bg-amber-50 text-amber-700" }
    return { label: "Aman", class: "bg-emerald-50 text-emerald-700" }
}

/* =======================
   STATS
======================= */
const totalProduk = computed(() => medicines.value.length)

const stokRendah = computed(() =>
    medicines.value.filter(i => i.stok <= 30 && i.stok > 10).length
)

const stokKritis = computed(() =>
    medicines.value.filter(i => i.stok <= 10).length
)

/* =======================
   ACTIONS
======================= */
const onFileSelected = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        selectedFile.value = target.files[0]
        previewUrl.value = URL.createObjectURL(target.files[0])
    }
}

const openCreate = () => {
    isEdit.value = false
    selectedId.value = null
    selectedFile.value = null
    previewUrl.value = null
    form.nama = ''
    form.harga = 0
    form.stok = 0
    form.deskripsi = ''
    form.image_url = ''
    showModal.value = true
}

const openEdit = (item: any) => {
    isEdit.value = true
    selectedId.value = item.id
    selectedFile.value = null
    previewUrl.value = item.image_url || null

    form.nama = item.nama
    form.harga = item.harga
    form.stok = item.stok
    form.deskripsi = item.deskripsi || ''
    form.image_url = item.image_url || ''
    showModal.value = true
}

const submitForm = async () => {
    if (!form.nama.trim()) {
        alert("Nama obat wajib diisi")
        return
    }

    try {
        submitting.value = true

        if (selectedFile.value) {
            const formData = new FormData()
            formData.append('nama', form.nama)
            formData.append('harga', String(form.harga))
            formData.append('stok', String(form.stok))
            if (form.deskripsi) formData.append('deskripsi', form.deskripsi)
            formData.append('image', selectedFile.value)

            if (isEdit.value && selectedId.value) {
                await updateObat(selectedId.value, formData)
            } else {
                await createObat(formData)
            }
        } else {
            const payload: any = {
                nama: form.nama,
                harga: form.harga,
                stok: form.stok,
                deskripsi: form.deskripsi || null
            }
            if (form.image_url) {
                payload.image_url = form.image_url
            }

            if (isEdit.value && selectedId.value) {
                await updateObat(selectedId.value, payload)
            } else {
                await createObat(payload)
            }
        }

        showModal.value = false
    } catch (err: any) {
        console.error("Gagal menyimpan obat", err)
        alert(err?.data?.error || "Gagal menyimpan obat")
    } finally {
        submitting.value = false
    }
}

const showDeleteModal = ref(false)
const deleteId = ref<string | null>(null)

const openDelete = (id: string) => {
    deleteId.value = id
    showDeleteModal.value = true
}

const confirmDelete = async () => {
    if (!deleteId.value) return

    await deleteObat(deleteId.value)
    showDeleteModal.value = false
}
</script>

<template>
    <AppLoadingOverlay v-if="loading" label="Memuat data obat..." description="Katalog obat sedang diambil dari API." />

    <div class="space-y-6">
        <section class="grid gap-5 md:grid-cols-3">
            <AdminMetricCard title="Total Produk" :value="totalProduk" icon="solar:pills-3-bold-duotone"
                badge="Semua produk" />

            <AdminMetricCard title="Stok Rendah" :value="stokRendah" icon="solar:box-bold-duotone" badge="Perlu restock"
                icon-class="bg-amber-50 text-amber-700" />

            <AdminMetricCard title="Stok Kritis" :value="stokKritis" icon="solar:danger-triangle-bold-duotone"
                badge="Segera tindakan" icon-class="bg-rose-50 text-rose-700" />
        </section>

        <section
            class="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">

            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-slate-900">
                    Daftar Obat
                </h3>

                <button @click="openCreate" class="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm">
                    <span class="text-lg leading-none">+</span> Tambah Obat
                </button>
            </div>

            <div class="mt-5 overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead class="text-left text-slate-400">
                        <tr>
                            <th class="px-4 py-3 font-medium">Foto</th>
                            <th class="px-4 py-3 font-medium">Nama Obat</th>
                            <th class="px-4 py-3 font-medium">Harga</th>
                            <th class="px-4 py-3 font-medium">Stok</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="6" class="text-center py-6 text-gray-400">
                                Memuat data...
                            </td>
                        </tr>

                        <tr v-else-if="medicines.length === 0">
                            <td colspan="6" class="text-center py-6 text-gray-400">
                                Belum ada data obat
                            </td>
                        </tr>

                        <tr v-else v-for="item in medicines" :key="item.id" class="border-t border-slate-100 hover:bg-slate-50/50 transition">
                            <td class="px-4 py-3">
                                <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex items-center justify-center">
                                    <img v-if="item.image_url" :src="item.image_url" :alt="item.nama" class="w-full h-full object-cover" />
                                    <span v-else class="text-xs text-slate-400">No Img</span>
                                </div>
                            </td>

                            <td class="px-4 py-4">
                                <div class="font-semibold text-slate-800">{{ item.nama }}</div>
                                <div v-if="item.deskripsi" class="text-xs text-slate-400 line-clamp-1 max-w-xs">{{ item.deskripsi }}</div>
                            </td>

                            <td class="px-4 py-4 text-slate-700 font-medium">
                                Rp {{ Number(item.harga).toLocaleString('id-ID') }}
                            </td>

                            <td class="px-4 py-4 text-slate-600">
                                {{ item.stok }}
                            </td>

                            <td class="px-4 py-4">
                                <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="getStatus(item.stok).class">
                                    {{ getStatus(item.stok).label }}
                                </span>
                            </td>

                            <td class="px-4 py-4 flex gap-2 items-center">
                                <button @click="openEdit(item)"
                                    class="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 font-medium rounded-lg hover:bg-emerald-100 transition">
                                    Edit
                                </button>

                                <button @click="openDelete(item.id)"
                                    class="px-3 py-1.5 text-xs bg-rose-50 text-rose-700 font-medium rounded-lg hover:bg-rose-100 transition">
                                    Hapus
                                </button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>

    <!-- MODAL CREATE / EDIT -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

            <h2 class="text-lg font-semibold text-slate-900 mb-4">
                {{ isEdit ? 'Edit Data Obat' : 'Tambah Obat Baru' }}
            </h2>

            <div class="space-y-4">
                <!-- PREVIEW FOTO -->
                <div>
                    <label class="text-sm font-medium text-slate-700 mb-1.5 block">
                        Foto Obat (Cloudinary)
                    </label>
                    <div class="flex items-center gap-4">
                        <div class="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
                            <span v-else class="text-xs text-slate-400 text-center px-1">Belum ada foto</span>
                        </div>
                        <div class="flex-1">
                            <input type="file" accept="image/*" @change="onFileSelected"
                                class="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                            <p class="text-[11px] text-slate-400 mt-1">Format: JPG, PNG, WEBP (Otomatis diupload ke Cloudinary)</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="text-sm font-medium text-slate-700 mb-1 block">
                        Nama Obat <span class="text-rose-500">*</span>
                    </label>
                    <input v-model="form.nama"
                        class="w-full border border-slate-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        placeholder="Contoh: Paracetamol 500mg" />
                </div>

                <div>
                    <label class="text-sm font-medium text-slate-700 mb-1 block">
                        Deskripsi Singkat
                    </label>
                    <textarea v-model="form.deskripsi" rows="2"
                        class="w-full border border-slate-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        placeholder="Keterangan obat, dosis, atau indikasi..." />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-sm font-medium text-slate-700 mb-1 block">
                            Harga (Rp) <span class="text-rose-500">*</span>
                        </label>
                        <input v-model.number="form.harga" type="number" min="0"
                            class="w-full border border-slate-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="5000" />
                    </div>

                    <div>
                        <label class="text-sm font-medium text-slate-700 mb-1 block">
                            Stok <span class="text-rose-500">*</span>
                        </label>
                        <input v-model.number="form.stok" type="number" min="0"
                            class="w-full border border-slate-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="10" />
                    </div>
                </div>

            </div>

            <div class="flex justify-end gap-2 mt-6">
                <button :disabled="submitting" @click="showModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition">
                    Batal
                </button>

                <button :disabled="submitting" @click="submitForm" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition shadow-sm flex items-center gap-2">
                    <span v-if="submitting">Menyimpan...</span>
                    <span v-else>Simpan</span>
                </button>
            </div>

        </div>
    </div>

    <!-- MODAL DELETE -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
            <h2 class="text-lg font-semibold text-slate-900 mb-2">
                Hapus Data Obat
            </h2>

            <p class="text-sm text-slate-500 mb-6">
                Data obat yang sudah dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?
            </p>

            <div class="flex justify-end gap-3">
                <button @click="showDeleteModal = false"
                    class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-sm font-medium transition">
                    Batal
                </button>

                <button @click="confirmDelete"
                    class="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 text-sm font-medium transition shadow-sm">
                    Hapus
                </button>
            </div>
        </div>
    </div>
</template>
