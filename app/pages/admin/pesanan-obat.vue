<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({
    title: 'Pesanan Obat'
})

const statusFilter = ref('')
const search = ref('')
const page = ref(1)
const limit = 5

const { transaksi, fetchTransaksi, loading, totalPage } = useAdminTransaksi()

const loadData = async () => {
    await fetchTransaksi(statusFilter.value, page.value)
}

const totalPesanan = computed(() => transaksi.value.length)

const totalPaid = computed(() =>
    transaksi.value.filter(t => t.status === 'paid').length
)

const totalPending = computed(() =>
    transaksi.value.filter(t => t.status === 'pending').length
)



onMounted(loadData)

</script>

<template>
    <div class="space-y-6">
        <section class="grid gap-5 md:grid-cols-3">
            <AdminMetricCard title="Pesanan Masuk" icon="solar:bag-smile-bold-duotone" badge="Hari ini"
                description="Antrean sejak pagi" :value="totalPesanan" />
            <AdminMetricCard title="Siap Dikirim" :value="totalPaid" icon="solar:delivery-bold-duotone"
                badge="Siap diproses" description="Butuh pickup atau kurir" icon-class="bg-cyan-50 text-cyan-700"
                badge-class="bg-cyan-50 text-cyan-700" />
            <AdminMetricCard title="Tertahan" :value="totalPending" icon="solar:document-add-bold-duotone"
                badge="Perlu verifikasi" description="Terkait resep atau pembayaran"
                icon-class="bg-rose-50 text-rose-700" badge-class="bg-rose-50 text-rose-700" />
        </section>

        <section
            class="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div>
                <h3 class="text-lg font-semibold text-slate-900">
                    Daftar Pesanan Obat
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                    Fokus utama admin apotek ada di sini: mana pesanan yang harus diproses, diverifikasi, atau dikirim
                    lebih dulu.
                </p>
            </div>

            <div class="mt-5 space-y-4">
                <div class="flex gap-2 mb-4">
                    <button @click="statusFilter = ''; loadData()" class="btn px-3 py-1 border rounded bg-green-600 text-white">Semua</button>
                    <button @click="statusFilter = 'pending'; loadData()" class="btn px-3 py-1 border rounded ">Pending</button>
                    <button @click="statusFilter = 'paid'; loadData()" class="btn px-3 py-1 border rounded">Paid</button>
                    <button @click="statusFilter = 'failed'; loadData()" class="btn px-3 py-1 border rounded">Failed</button>
                </div>
                <div v-if="loading" class="text-sm text-gray-500">
                    Memuat pesanan...
                </div>

                <div v-else-if="transaksi.length === 0" class="text-sm text-gray-400">
                    Belum ada pesanan
                </div>

                <div v-else class="mt-5 space-y-4">
                    <div v-for="order in transaksi" :key="order.id" 
                        class="hover:bg-gray-100 transition flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div class="flex flex-wrap items-center gap-3">
                                <p class="font-semibold text-slate-900">
                                    {{ order.id }}
                                </p>

                                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="{
                                    'bg-yellow-50 text-yellow-700': order.status === 'pending',
                                    'bg-green-50 text-green-700': order.status === 'paid',
                                    'bg-red-50 text-red-700': order.status === 'failed'
                                }">
                                    {{ order.status }}
                                </span>
                            </div>

                            <p class="mt-1 text-sm text-slate-500">
                                {{ new Date(order.created_at).toLocaleString() }}
                            </p>
                        </div>

                        <p class="text-sm font-semibold text-slate-800">
                            Rp {{ order.total }}
                        </p>
                    </div>
                </div>
                <div class="flex justify-center gap-2 mt-6">

                    <button @click="page--; loadData()" :disabled="page === 1" class="px-3 py-1 border rounded">
                        Prev
                    </button>

                    <span class="px-3 py-1">
                        Page {{ page }} / {{ totalPage }}
                    </span>

                    <button @click="page++; loadData()" :disabled="page === totalPage" class="px-3 py-1 border rounded">
                        Next
                    </button>

                </div>
            </div>
        </section>
    </div>
</template>
