<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({ title: 'Data Apotek' })

const isEdit = ref(false)
const preview = ref<string | null>(null)
const saveMessage = ref('')
const saveState = ref<'success' | 'error'>('success')

const { form, loading, fetchApotek, updateApotek, photoFile, uploadPhoto } = useApotek()
const { initMap } = useMapPicker()
const config = useRuntimeConfig()

const currentPhotoUrl = computed(() => {
    if (preview.value) return preview.value
    if (form.value?.PhotoURL) {
        return config.public.apiBase + form.value.PhotoURL.replace('/public', '')
    }
    return null
})

const profileHighlights = computed(() => [
    {
        label: 'Status Profil',
        value: form.value?.nama ? 'Lengkap' : 'Perlu dilengkapi'
    },
    {
        label: 'Jam Operasional',
        value: form.value?.jam_buka && form.value?.jam_tutup
            ? `${form.value.jam_buka} - ${form.value.jam_tutup}`
            : 'Belum diatur'
    },
    {
        label: 'Titik Lokasi',
        value: form.value?.latitude && form.value?.longitude ? 'Sudah dipilih' : 'Belum dipilih'
    }
])

const handleFile = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    saveMessage.value = ''

    if (!file.type.startsWith('image/')) {
        saveState.value = 'error'
        saveMessage.value = 'File yang dipilih belum berupa gambar. Coba pilih JPG atau PNG, ya.'
        target.value = ''
        return
    }

    if (file.size > 2 * 1024 * 1024) {
        saveState.value = 'error'
        saveMessage.value = 'Ukuran foto terlalu besar. Gunakan gambar maksimal 2MB.'
        target.value = ''
        return
    }

    photoFile.value = file

    if (preview.value?.startsWith('blob:')) {
        URL.revokeObjectURL(preview.value)
    }

    preview.value = URL.createObjectURL(file)
}

const toggleEdit = async () => {
    saveMessage.value = ''

    if (isEdit.value) {
        await fetchApotek()
        if (preview.value?.startsWith('blob:')) {
            URL.revokeObjectURL(preview.value)
        }
        preview.value = null
        photoFile.value = null
    }

    isEdit.value = !isEdit.value
}

const handleSave = async () => {
    saveMessage.value = ''

    try {
        // 1️⃣ kalau ada foto baru → upload dulu
        if (photoFile.value) {
            await uploadPhoto()
        }

        // 2️⃣ ambil data terbaru (biar dapet PhotoURL)
        await fetchApotek()

        // 3️⃣ baru update data (bawa photo_url yang sudah ada)
        await updateApotek()

        await fetchApotek()

        saveState.value = 'success'
        saveMessage.value = 'Perubahan profil apotek berhasil disimpan.'
        isEdit.value = false

        if (preview.value?.startsWith('blob:')) {
            URL.revokeObjectURL(preview.value)
        }

        preview.value = null
        photoFile.value = null

    } catch (err: any) {
        saveState.value = 'error'
        saveMessage.value = err?.data?.message || err?.message
    }
}

onMounted(async () => {
    await fetchApotek()
    await nextTick()
    initMap('map', form, isEdit)
})

onBeforeUnmount(() => {
    if (preview.value?.startsWith('blob:')) {
        URL.revokeObjectURL(preview.value)
    }
})
</script>

<template>
    <div class="space-y-6 pb-8">
        <div v-if="saveMessage" class="rounded-[24px] border px-5 py-4 shadow-sm" :class="saveState === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-rose-200 bg-rose-50 text-rose-800'">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="font-semibold">
                        {{ saveState === 'success' ? 'Perubahan tersimpan' : 'Masih ada yang perlu dicek' }}
                    </p>
                    <p class="mt-1 text-sm">
                        {{ saveMessage }}
                    </p>
                </div>

                <button @click="saveMessage = ''" class="text-sm font-medium opacity-70 transition hover:opacity-100">
                    Tutup
                </button>
            </div>
        </div>

        <section
            class="overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-[#0f766e] via-[#14967f] to-[#0e7490] px-7 py-8 text-white shadow-[0_28px_70px_rgba(15,118,110,0.22)]">
            <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
                <div>
                    <p class="text-sm uppercase tracking-[0.28em] text-emerald-50/75">
                        Profil Apotek
                    </p>
                    <h2 class="mt-3 max-w-3xl text-3xl font-semibold leading-tight">
                        Atur identitas apotek, foto toko, jam operasional, dan lokasi dalam satu halaman yang lebih
                        nyaman dipakai.
                    </h2>
                    <p class="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
                        Saya rapikan halaman ini supaya terasa seperti profil bisnis yang aktif dipakai admin apotek,
                        bukan sekadar form biasa.
                    </p>
                </div>

                <div
                    class="grid gap-3 rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur sm:grid-cols-3 xl:grid-cols-1">
                    <div v-for="item in profileHighlights" :key="item.label" class="rounded-2xl bg-white/10 px-4 py-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-emerald-50/70">
                            {{ item.label }}
                        </p>
                        <p class="mt-2 text-lg font-semibold">
                            {{ item.value }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div
                class="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 class="text-xl font-semibold text-slate-900">
                            Foto dan Identitas
                        </h3>
                        <p class="mt-1 text-sm text-slate-500">
                            Tambahkan foto apotek yang rapi agar tampilan profil lebih meyakinkan.
                        </p>
                    </div>

                    <button @click="toggleEdit" class="rounded-2xl px-4 py-2.5 text-sm font-semibold transition" :class="isEdit
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'">
                        {{ isEdit ? 'Batal Edit' : 'Edit Profil' }}
                    </button>
                </div>

                <div class="mt-6 rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
                    <div class="flex flex-col gap-6 lg:flex-row">
                        <div class="w-full max-w-[220px]">
                            <div
                                class="relative aspect-square overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-inner">
                                <img v-if="currentPhotoUrl" :src="currentPhotoUrl" class="h-full w-full object-cover" />
                                <div v-else class="flex h-full items-center justify-center text-sm text-slate-400">
                                    Belum ada foto
                                </div>

                                <div
                                    class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent px-4 py-4 text-white">
                                    <p class="text-xs uppercase tracking-[0.18em] text-white/70">
                                        Foto Apotek
                                    </p>
                                    <p class="mt-1 text-sm font-medium">
                                        Preview profil toko
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="flex-1 space-y-4">
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="rounded-3xl border border-slate-200 bg-white px-4 py-4">
                                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        Nama Apotek
                                    </p>
                                    <p class="mt-2 text-base font-semibold text-slate-900">
                                        {{ form.nama || 'Belum diisi' }}
                                    </p>
                                </div>

                                <div class="rounded-3xl border border-slate-200 bg-white px-4 py-4">
                                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        Nomor Kontak
                                    </p>
                                    <p class="mt-2 text-base font-semibold text-slate-900">
                                        {{ form.phone_number || 'Belum diisi' }}
                                    </p>
                                </div>
                            </div>

                            <div class="rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-4">
                                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p class="font-semibold text-slate-800">
                                            Unggah foto apotek
                                        </p>
                                        <p class="mt-1 text-sm text-slate-500">
                                            Foto akan langsung dipakai sebagai preview profil apotek.
                                        </p>
                                    </div>

                                    <label
                                        class="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                        :class="!isEdit ? 'pointer-events-none opacity-50' : ''">
                                        Pilih Foto
                                        <input type="file" accept="image/*" class="hidden" :disabled="!isEdit"
                                            @change="handleFile" />
                                    </label>
                                </div>

                                <p class="mt-3 text-xs text-slate-400">
                                    Format JPG atau PNG, maksimal 2MB.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <h3 class="text-xl font-semibold text-slate-900">
                    Informasi Utama
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                    Semua data penting apotek bisa kamu ubah dari sini saat mode edit aktif.
                </p>

                <div class="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                        <label class="mb-1 block text-sm text-slate-500">
                            Nama Apotek
                        </label>
                        <input v-model="form.nama" :disabled="!isEdit"
                            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
                            placeholder="Nama apotek" />
                    </div>

                    <div>
                        <label class="mb-1 block text-sm text-slate-500">
                            No HP
                        </label>
                        <input v-model="form.phone_number" :disabled="!isEdit"
                            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
                            placeholder="Nomor yang bisa dihubungi" />
                    </div>

                    <div>
                        <label class="mb-1 block text-sm text-slate-500">
                            Jam Buka
                        </label>
                        <input v-model="form.jam_buka" type="time" :disabled="!isEdit"
                            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-500" />
                    </div>

                    <div>
                        <label class="mb-1 block text-sm text-slate-500">
                            Jam Tutup
                        </label>
                        <input v-model="form.jam_tutup" type="time" :disabled="!isEdit"
                            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-500" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="mb-1 block text-sm text-slate-500">
                            Alamat
                        </label>
                        <textarea v-model="form.alamat" :disabled="!isEdit" rows="3"
                            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
                            placeholder="Alamat lengkap apotek"></textarea>
                    </div>

                    <div class="md:col-span-2">
                        <label class="mb-1 block text-sm text-slate-500">
                            Deskripsi
                        </label>
                        <textarea v-model="form.deskripsi" :disabled="!isEdit" rows="4"
                            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
                            placeholder="Ceritakan layanan utama apotekmu"></textarea>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-semibold text-slate-900">
                        Lokasi Apotek
                    </h3>
                    <p class="mt-1 text-sm text-slate-500">
                        Klik peta untuk memperbarui titik lokasi saat mode edit aktif.
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600">
                    Lat {{ form.latitude || '-' }} | Lng {{ form.longitude || '-' }}
                </div>
            </div>

            <ClientOnly>
                <div id="map" class="mt-5 h-[420px] w-full overflow-hidden rounded-[28px] border border-slate-200">
                </div>
            </ClientOnly>
        </section>

        <div v-if="isEdit"
            class="sticky bottom-4 z-20 rounded-[28px] border border-amber-200 bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p class="font-semibold text-slate-900">
                        Simpan perubahan profil apotek
                    </p>
                    <p class="mt-1 text-sm text-slate-500">
                        Pastikan data dan foto sudah sesuai sebelum disimpan.
                    </p>
                </div>

                <button @click="handleSave" :disabled="loading"
                    class="rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300 disabled:opacity-70">
                    {{ loading ? 'Menyimpan perubahan...' : 'Simpan Perubahan' }}
                </button>
            </div>
        </div>

    </div>
</template>
