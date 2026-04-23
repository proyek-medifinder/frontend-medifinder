<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

useHead({
    title: 'Pesanan Obat'
})

const orders = [
    { code: 'ORD-301', customer: 'Maya Putri', total: 'Rp 145.000', status: 'Perlu diproses', badge: 'bg-amber-50 text-amber-700', time: '10 menit lalu' },
    { code: 'ORD-302', customer: 'Rizky Maulana', total: 'Rp 218.000', status: 'Siap kirim', badge: 'bg-emerald-50 text-emerald-700', time: '24 menit lalu' },
    { code: 'ORD-303', customer: 'Nina Aulia', total: 'Rp 84.000', status: 'Menunggu bayar', badge: 'bg-sky-50 text-sky-700', time: '40 menit lalu' },
    { code: 'ORD-304', customer: 'Asep Hidayat', total: 'Rp 332.000', status: 'Butuh verifikasi resep', badge: 'bg-rose-50 text-rose-700', time: '1 jam lalu' }
]
</script>

<template>
    <div class="space-y-6">
        <section class="grid gap-5 md:grid-cols-3">
            <AdminMetricCard title="Pesanan Masuk" value="12" icon="solar:bag-smile-bold-duotone" badge="Hari ini"
                description="Antrean sejak pagi" />
            <AdminMetricCard title="Siap Dikirim" value="5" icon="solar:delivery-bold-duotone" badge="Siap diproses"
                description="Butuh pickup atau kurir" icon-class="bg-cyan-50 text-cyan-700"
                badge-class="bg-cyan-50 text-cyan-700" />
            <AdminMetricCard title="Tertahan" value="2" icon="solar:document-add-bold-duotone" badge="Perlu verifikasi"
                description="Terkait resep atau pembayaran" icon-class="bg-rose-50 text-rose-700"
                badge-class="bg-rose-50 text-rose-700" />
        </section>

        <section class="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div>
                <h3 class="text-lg font-semibold text-slate-900">
                    Daftar Pesanan Obat
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                    Fokus utama admin apotek ada di sini: mana pesanan yang harus diproses, diverifikasi, atau dikirim lebih dulu.
                </p>
            </div>

            <div class="mt-5 space-y-4">
                <div v-for="order in orders" :key="order.code"
                    class="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div class="flex flex-wrap items-center gap-3">
                            <p class="font-semibold text-slate-900">{{ order.code }}</p>
                            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="order.badge">
                                {{ order.status }}
                            </span>
                        </div>
                        <p class="mt-1 text-sm text-slate-500">
                            {{ order.customer }} • {{ order.time }}
                        </p>
                    </div>

                    <p class="text-sm font-semibold text-slate-800">
                        {{ order.total }}
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>
