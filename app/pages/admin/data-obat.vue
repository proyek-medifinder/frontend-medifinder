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

const form = reactive({
    nama: '',
    harga: 0,
    stok: 0
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
const openCreate = () => {
    isEdit.value = false
    showModal.value = true
    form.nama = ''
    form.harga = 0
    form.stok = 0
}

const openEdit = (item: any) => {
    isEdit.value = true
    showModal.value = true
    selectedId.value = item.id

    form.nama = item.nama
    form.harga = item.harga
    form.stok = item.stok
}

const submitForm = async () => {
    if (isEdit.value && selectedId.value) {
        await updateObat(selectedId.value, form)
    } else {
        await createObat(form)
    }

    showModal.value = false
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

const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus obat ini?")) return
    await deleteObat(id)
}
</script>

<template>
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

                <button @click="openCreate" class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                    + Tambah Obat
                </button>
            </div>

            <div class="mt-5 overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead class="text-left text-slate-400">
                        <tr>
                            <th class="px-4 py-3 font-medium">Nama Obat</th>
                            <th class="px-4 py-3 font-medium">Kategori</th>
                            <th class="px-4 py-3 font-medium">Stok</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="4" class="text-center py-6 text-gray-400">
                                Memuat data...
                            </td>
                        </tr>

                        <tr v-else-if="medicines.length === 0">
                            <td colspan="4" class="text-center py-6 text-gray-400">
                                Belum ada data obat
                            </td>
                        </tr>

                        <tr v-else v-for="item in medicines" :key="item.id" class="border-t border-slate-100">

                            <td class="px-4 py-4 font-semibold text-slate-800">
                                {{ item.nama }}
                            </td>

                            <td class="px-4 py-4 text-slate-600">
                                {{ item.kategori || '-' }}
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

                            <td class="px-4 py-4 flex gap-2">

                                <button @click="openEdit(item)"
                                    class="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Edit
                                </button>

                                <button @click="openDelete(item.id)"
                                    class="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                                    Hapus
                                </button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-md rounded-2xl p-6">

            <h2 class="text-lg font-semibold mb-4">
                {{ isEdit ? 'Edit Obat' : 'Tambah Obat' }}
            </h2>
            <div class="space-y-4">

                <div>
                    <label class="text-sm text-gray-600 mb-1 block">
                        Nama Obat
                    </label>
                    <input v-model="form.nama"
                        class="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Masukkan nama obat" />
                </div>

                <div>
                    <label class="text-sm text-gray-600 mb-1 block">
                        Harga
                    </label>
                    <input v-model.number="form.harga" type="number"
                        class="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Masukkan harga" />
                </div>

                <div>
                    <label class="text-sm text-gray-600 mb-1 block">
                        Stok
                    </label>
                    <input v-model.number="form.stok" type="number"
                        class="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Masukkan stok" />
                </div>

            </div>

            <div class="flex justify-end gap-2 mt-6">
                <button @click="showModal = false" class="px-4 py-2 bg-gray-200 rounded">
                    Batal
                </button>

                <button @click="submitForm" class="px-4 py-2 bg-emerald-600 text-white rounded">
                    Simpan
                </button>
            </div>

        </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div class="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg">

            <!-- TITLE -->
            <h2 class="text-lg font-semibold text-gray-800 mb-2">
                Hapus Data Obat
            </h2>

            <!-- MESSAGE -->
            <p class="text-sm text-gray-500 mb-6">
                Data obat yang sudah dihapus tidak dapat dikembalikan.
                Yakin mau lanjut?
            </p>

            <!-- BUTTON -->
            <div class="flex justify-end gap-3">

                <button @click="showDeleteModal = false"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    Batal
                </button>

                <button @click="confirmDelete"
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    Hapus
                </button>

            </div>

        </div>
    </div>
</template>
