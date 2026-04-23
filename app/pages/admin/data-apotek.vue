<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({ title: 'Data Apotek' })

const isEdit = ref(false)

const { form, loading, fetchApotek, updateApotek } = useApotek()
const { initMap } = useMapPicker()

onMounted(async () => {
    await fetchApotek()
    await nextTick()
    initMap('map', form, isEdit)
})
</script>

<template>
    <div class="space-y-6">

        <!-- HEADER -->
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-semibold text-gray-800">
                    Profil Apotek
                </h2>
                <p class="text-sm text-gray-500">
                    Kelola informasi apotek Anda
                </p>
            </div>

            <button @click="isEdit = !isEdit"
                class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
                {{ isEdit ? 'Batal' : 'Edit' }}
            </button>
        </div>

        <!-- FORM -->
        <div class="bg-white p-6 rounded-2xl shadow-sm">
            <div class="grid md:grid-cols-2 gap-4">

                <!-- Nama -->
                <div>
                    <label class="text-sm text-gray-500 mb-1 block">
                        Nama Apotek
                    </label>
                    <input v-model="form.nama" :disabled="!isEdit" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                    disabled:bg-gray-100 disabled:text-gray-500" placeholder="Nama Apotek" />
                </div>

                <!-- No HP -->
                <div>
                    <label class="text-sm text-gray-500 mb-1 block">
                        No HP
                    </label>
                    <input v-model="form.phone_number" :disabled="!isEdit" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                    disabled:bg-gray-100 disabled:text-gray-500" placeholder="No HP" />
                </div>

                <!-- Jam Buka -->
                <div>
                    <label class="text-sm text-gray-500 mb-1 block">
                        Jam Buka
                    </label>
                    <input v-model="form.jam_buka" type="time" :disabled="!isEdit" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
        focus:outline-none focus:ring-2 focus:ring-emerald-500
        disabled:bg-gray-100 disabled:text-gray-500" />
                </div>

                <!-- Jam Tutup -->
                <div>
                    <label class="text-sm text-gray-500 mb-1 block">
                        Jam Tutup
                    </label>
                    <input v-model="form.jam_tutup" type="time" :disabled="!isEdit" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
        focus:outline-none focus:ring-2 focus:ring-emerald-500
        disabled:bg-gray-100 disabled:text-gray-500" />
                </div>

                <!-- Alamat -->
                <div class="md:col-span-2">
                    <label class="text-sm text-gray-500 mb-1 block">
                        Alamat
                    </label>
                    <textarea v-model="form.alamat" :disabled="!isEdit" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                    disabled:bg-gray-100 disabled:text-gray-500" placeholder="Alamat"></textarea>
                </div>

                <!-- Deskripsi -->
                <div class="md:col-span-2">
                    <label class="text-sm text-gray-500 mb-1 block">
                        Deskripsi
                    </label>
                    <textarea v-model="form.deskripsi" :disabled="!isEdit" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                    disabled:bg-gray-100 disabled:text-gray-500" placeholder="Deskripsi"></textarea>
                </div>

            </div>
        </div>

        <!-- MAP -->
        <div class="bg-white p-6 rounded-2xl shadow-sm">
            <p class="text-sm font-medium text-gray-700 mb-2">
                Lokasi Apotek
            </p>

            <ClientOnly>
                <div id="map" class="w-full h-[400px] rounded-xl overflow-hidden"></div>
            </ClientOnly>

            <p class="text-xs mt-2 text-gray-500">
                Lat: {{ form.latitude }} | Lng: {{ form.longitude }}
            </p>
        </div>

        <!-- SAVE BUTTON -->
        <div v-if="isEdit">
            <button @click="updateApotek" :disabled="loading"
                class="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 rounded-xl transition disabled:opacity-70">
                {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
        </div>

    </div>
</template>