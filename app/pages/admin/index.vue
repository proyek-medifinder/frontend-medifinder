<template>
    <div v-if="!isLoaded" class="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="h-72 animate-pulse rounded-[32px] bg-white/70" />
        <div class="h-72 animate-pulse rounded-[32px] bg-white/70" />
        <div class="h-40 animate-pulse rounded-[32px] bg-white/70 lg:col-span-2" />
    </div>
    <!-- 🔒 KHUSUS ADMIN APOTEK -->
    <div v-else-if="userRole === 'admin_apotek'" class="space-y-6">
        <section
            class="overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-[#0f766e] via-[#14967f] to-[#0f766e] p-8 text-white shadow-[0_28px_70px_rgba(15,118,110,0.28)]">
            <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                    <p class="text-sm uppercase tracking-[0.28em] text-emerald-50/75">
                        Dashboard Admin Apotek
                    </p>
                    <h2 class="mt-3 max-w-2xl text-3xl font-semibold leading-tight">
                        Fokus ke operasional harian, stok obat, dan pesanan yang harus diproses lebih dulu.
                    </h2>
                    <p class="mt-4 max-w-2xl text-sm text-emerald-50/85">
                        Untuk role admin apotek, dashboard paling berguna biasanya menampilkan pesanan baru, omzet harian, obat dengan stok menipis, status toko, dan daftar pekerjaan yang perlu segera ditindaklanjuti.
                    </p>
                </div>

                <div class="grid gap-3 rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-emerald-50/75">Status apotek</span>
                        <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Buka
                        </span>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="rounded-2xl bg-white/10 p-4">
                            <p class="text-xs text-emerald-50/70">Pesanan perlu diproses</p>
                            <p class="mt-2 text-2xl font-semibold">12</p>
                        </div>
                        <div class="rounded-2xl bg-white/10 p-4">
                            <p class="text-xs text-emerald-50/70">Stok kritis</p>
                            <p class="mt-2 text-2xl font-semibold">8</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard title="Pesanan Baru" value="12" icon="solar:bag-smile-bold-duotone" badge="+3 hari ini"
                description="Pesanan masuk sejak pukul 08.00" icon-class="bg-cyan-50 text-cyan-700"
                badge-class="bg-cyan-50 text-cyan-700" />
            <AdminMetricCard title="Omzet Hari Ini" value="Rp 2,8 Jt" icon="solar:wallet-money-bold-duotone"
                badge="+14%" description="Dibanding kemarin" />
            <AdminMetricCard title="Obat Aktif" value="186" icon="solar:pills-3-bold-duotone" badge="24 kategori"
                description="Produk tersedia di etalase" icon-class="bg-amber-50 text-amber-700"
                badge-class="bg-amber-50 text-amber-700" />
            <AdminMetricCard title="Stok Menipis" value="8" icon="solar:danger-triangle-bold-duotone"
                badge="Butuh restock" description="Prioritas pembelian minggu ini"
                icon-class="bg-rose-50 text-rose-700" badge-class="bg-rose-50 text-rose-700" />
        </section>

        <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <AdminTrendChart title="Tren Pesanan Mingguan" subtitle="Jumlah pesanan diproses selama 6 hari terakhir"
                :values="[14, 18, 16, 22, 19, 27]" :labels="['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']"
                summary="Rata-rata 19 pesanan/hari" />

            <AdminBarChart title="Sebaran Status Stok" subtitle="Ringkasan kondisi inventori saat ini"
                :values="[112, 46, 20, 8]" :labels="['Aman', 'Sedang', 'Rendah', 'Kritis']"
                summary="8 item perlu tindakan cepat" />
        </section>

        <section class="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div class="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900">Pesanan Terbaru</h3>
                        <p class="mt-1 text-sm text-slate-500">
                            Daftar pesanan yang paling perlu ditangani oleh admin apotek.
                        </p>
                    </div>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        5 antrean aktif
                    </span>
                </div>

                <div class="mt-5 space-y-4">
                    <div v-for="order in apotekOrders" :key="order.id"
                        class="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div class="flex items-center gap-3">
                                <p class="font-semibold text-slate-900">{{ order.customer }}</p>
                                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="order.badgeClass">
                                    {{ order.status }}
                                </span>
                            </div>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ order.items }} - {{ order.time }}
                            </p>
                        </div>

                        <div class="text-right">
                            <p class="font-semibold text-slate-900">{{ order.total }}</p>
                            <p class="text-xs text-slate-500">{{ order.note }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900">Tugas Prioritas</h3>
                        <p class="mt-1 text-sm text-slate-500">
                            Fokus kerja yang paling masuk akal untuk admin apotek hari ini.
                        </p>
                    </div>
                    <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Checklist harian
                    </span>
                </div>

                <div class="mt-5 space-y-4">
                    <div v-for="task in apotekTasks" :key="task.title" class="rounded-3xl border border-slate-200/70 p-4">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="font-semibold text-slate-900">{{ task.title }}</p>
                                <p class="mt-1 text-sm text-slate-500">{{ task.description }}</p>
                            </div>
                            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="task.badgeClass">
                                {{ task.badge }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- 🔥 KHUSUS SUPER ADMIN -->
    <div v-else class="space-y-8 pb-8">

        <!-- MODAL -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4">
            <div class="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl">

                <h2 class="text-lg font-semibold mb-4">
                    Detail Pendaftar
                </h2>

                <div class="space-y-2 text-sm text-gray-700">
                    <p><b>Nama Apotek:</b> {{ selectedAdmin?.nama_apotek }}</p>
                    <p><b>Nama Pemilik:</b> {{ selectedAdmin?.name }}</p>
                    <p><b>Email:</b> {{ selectedAdmin?.email }}</p>
                    <p><b>No HP:</b> {{ selectedAdmin?.phone_number }}</p>
                    <p><b>Alamat:</b> {{ selectedAdmin?.alamat }}</p>
                    <p><b>Deskripsi:</b> {{ selectedAdmin?.deskripsi }}</p>
                </div>

                <div class="mt-4">
                    <p class="text-sm font-semibold mb-2">Lokasi:</p>

                    <ClientOnly>
                        <div id="detail-map" class="w-full h-40 rounded-lg"></div>
                    </ClientOnly>
                </div>

                <div class="flex justify-end mt-6">
                    <button @click="showModal = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                        Tutup
                    </button>
                </div>

            </div>
        </div>

        <!-- 🔥 DASHBOARD SUPER ADMIN -->
        <div class="space-y-8">

            <!-- STATS -->
            <section
                class="overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-[#0f766e] via-[#159a85] to-[#0e7490] px-8 py-9 text-white shadow-[0_28px_70px_rgba(15,118,110,0.25)]">
                <div class="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:items-end">
                    <div>
                        <p class="text-sm uppercase tracking-[0.28em] text-emerald-50/75">Dashboard Super Admin</p>
                        <h2 class="mt-4 max-w-3xl text-3xl font-semibold leading-tight xl:max-w-4xl">
                            Satu panel untuk memantau pertumbuhan admin, proses verifikasi, dan performa jaringan apotek.
                        </h2>
                        <p class="mt-5 max-w-2xl text-sm leading-7 text-emerald-50/85">
                            Saya tambahkan ringkasan visual dan chart agar dashboard super admin terasa lebih strategis.
                        </p>
                    </div>

                    <div class="grid gap-4 self-start rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur xl:ml-4">
                        <p class="text-sm text-emerald-50/70">Snapshot minggu ini</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="rounded-2xl bg-white/10 px-4 py-5">
                                <p class="text-xs text-emerald-50/70">Menunggu verifikasi</p>
                                <p class="mt-2 text-2xl font-semibold">{{ pendingAdmins.length }}</p>
                            </div>
                            <div class="rounded-2xl bg-white/10 px-4 py-5">
                                <p class="text-xs text-emerald-50/70">Admin aktif</p>
                                <p class="mt-2 text-2xl font-semibold">{{ totalAdmin }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <AdminMetricCard title="Total Admin" :value="loading ? '...' : totalAdmin" icon="solar:user-id-bold-duotone"
                    badge="+2 bulan ini" description="Akun admin apotek aktif" />
                <AdminMetricCard title="Total Apotek" :value="totalApotek" icon="solar:hospital-bold-duotone"
                    badge="Jaringan aktif" description="Cabang yang sudah terverifikasi"
                    icon-class="bg-cyan-50 text-cyan-700" badge-class="bg-cyan-50 text-cyan-700" />
                <AdminMetricCard title="Total Obat" :value="totalObat" icon="solar:pills-3-bold-duotone" badge="Katalog inti"
                    description="Item utama yang termonitor" icon-class="bg-amber-50 text-amber-700"
                    badge-class="bg-amber-50 text-amber-700" />
                <AdminMetricCard title="Perlu Review" :value="pendingAdmins.length" icon="solar:clipboard-check-bold-duotone"
                    badge="Antrian verifikasi" description="Pengajuan menunggu keputusan"
                    icon-class="bg-rose-50 text-rose-700" badge-class="bg-rose-50 text-rose-700" />
            </section>

            <section class="grid gap-7 xl:grid-cols-[1.2fr_0.8fr]">
                <AdminTrendChart title="Tren Aktivasi Admin" subtitle="Simulasi pertumbuhan akun admin apotek per bulan"
                    :values="[4, 7, 10, 14, 18, 21]" :labels="['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']"
                    summary="Naik konsisten 6 bulan" />
                <AdminBarChart title="Komposisi Prioritas" subtitle="Distribusi fokus pemantauan super admin"
                    :values="[pendingAdmins.length || 1, totalApotek, totalObat, 6]"
                    :labels="['Review', 'Apotek', 'Obat', 'Kontak']" summary="Fokus terbesar pada operasional" />
            </section>

            <!-- TABLE -->
            <div class="rounded-[28px] border border-slate-200/70 bg-white/90 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <h2 class="font-semibold text-gray-800 mb-4">
                    Menunggu Verifikasi
                </h2>

                <div v-if="pendingAdmins.length === 0"
                    class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-sm text-gray-400">
                    Belum ada apotek yang menunggu verifikasi
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="text-gray-500 border-b">
                            <tr>
                                <th class="py-3">Nama Apotek</th>
                                <th>Email</th>
                                <th>No HP</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="admin in pendingAdmins" :key="admin.id" class="border-b hover:bg-gray-50">
                                <td class="py-3 font-medium text-gray-800">
                                    {{ admin.nama_apotek }}
                                </td>
                                <td>{{ admin.email }}</td>
                                <td>{{ admin.phone_number }}</td>

                                <td class="flex gap-2 py-2">
                                    <button @click="openDetail(admin)"
                                        class="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">
                                        Detail
                                    </button>

                                    <button @click="verifyAdmin(admin.id)"
                                        class="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
                                        Verifikasi
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "admin",
    middleware: "admin"
})

useHead({
    title: "Dashboard Admin"
})

const config = useRuntimeConfig()
const token = useCookie<string | null>("auth_token")

const totalAdmin = ref(0)
const totalApotek = ref(24)
const totalObat = ref(186)
const loading = ref(true)

const userRole = ref('')
const apotekOrders = [
    {
        id: 'ORD-301',
        customer: 'Maya Putri',
        items: 'Paracetamol, Vitamin C',
        time: 'Masuk 10 menit lalu',
        total: 'Rp 145.000',
        note: 'Butuh konfirmasi stok',
        badgeClass: 'bg-amber-50 text-amber-700',
        status: 'Perlu diproses'
    },
    {
        id: 'ORD-302',
        customer: 'Rizky Maulana',
        items: 'Amoxicillin, OBH Combi',
        time: 'Masuk 24 menit lalu',
        total: 'Rp 218.000',
        note: 'Siap dikemas',
        badgeClass: 'bg-emerald-50 text-emerald-700',
        status: 'Siap kirim'
    },
    {
        id: 'ORD-303',
        customer: 'Nina Aulia',
        items: 'Sanmol, Antangin',
        time: 'Masuk 40 menit lalu',
        total: 'Rp 84.000',
        note: 'Menunggu pembayaran',
        badgeClass: 'bg-sky-50 text-sky-700',
        status: 'Menunggu bayar'
    }
]

const apotekTasks = [
    {
        title: 'Restock obat demam dan flu',
        description: 'Paracetamol, Sanmol, dan OBH Combi mulai mendekati batas stok minimum.',
        badge: 'Mendesak',
        badgeClass: 'bg-rose-50 text-rose-700'
    },
    {
        title: 'Tindak lanjuti 5 pesanan tertahan',
        description: 'Beberapa pelanggan masih menunggu konfirmasi ketersediaan obat resep.',
        badge: 'Hari ini',
        badgeClass: 'bg-amber-50 text-amber-700'
    },
    {
        title: 'Perbarui jam operasional libur',
        description: 'Informasi toko di sistem perlu disesuaikan untuk akhir pekan ini.',
        badge: 'Info',
        badgeClass: 'bg-emerald-50 text-emerald-700'
    }
]

const fetchDashboardData = async () => {
    try {
        loading.value = true

        const res = await $fetch<any>(`${config.public.apiBase}/me`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            }
        })

        userRole.value = res.data.role

        if (userRole.value === 'super_admin') {
            const adminRes = await $fetch<any>(`${config.public.apiBase}/superadmin/admin`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            totalAdmin.value = adminRes?.data?.length || 0
        }
    } catch (err) {
        console.error('Gagal ambil data user', err)
    } finally {
        loading.value = false
    }
}

const pendingAdmins = ref<any[]>([])
const superAdminTasks = computed(() => [
    {
        title: 'Tinjau pengajuan admin apotek baru',
        description: `Ada ${pendingAdmins.value.length} pengajuan yang menunggu verifikasi dan sebaiknya diputuskan lebih cepat.`,
        badge: 'Prioritas',
        badgeClass: 'bg-rose-50 text-rose-700'
    },
    {
        title: 'Pantau pertumbuhan jaringan apotek',
        description: 'Dashboard kini menampilkan ringkasan pertumbuhan untuk membantu evaluasi ekspansi cabang.',
        badge: 'Strategis',
        badgeClass: 'bg-cyan-50 text-cyan-700'
    },
    {
        title: 'Review katalog obat inti',
        description: 'Gunakan ringkasan total obat sebagai checkpoint sebelum menambah kategori baru.',
        badge: 'Monitoring',
        badgeClass: 'bg-emerald-50 text-emerald-700'
    }
])
const selectedAdmin = ref<any | null>(null)
const showModal = ref(false)

const fetchPendingAdmins = async () => {
    try {
        const res = await $fetch<any>(
            `${config.public.apiBase}/superadmin/pengajuan`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        )

        pendingAdmins.value = res.data || []
    } catch (err) {
        console.error("Gagal ambil pending admin", err)
    }
}

let detailMap: any = null

const openDetail = async (admin: any) => {
    selectedAdmin.value = admin
    showModal.value = true

    await nextTick()

    if (!admin.latitude || !admin.longitude) return

    const leaflet = await import('leaflet')
    const L = leaflet.default

    if (detailMap) {
        detailMap.remove()
    }

    detailMap = L.map('detail-map').setView(
        [admin.latitude, admin.longitude],
        15
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(detailMap)
    L.marker([admin.latitude, admin.longitude]).addTo(detailMap)
}

const verifyAdmin = async (id: string) => {
    try {
        await $fetch(`${config.public.apiBase}/superadmin/verifikasi`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: {
                action: 'approved',
                admin_id: id,
                notes: 'Disetujui oleh admin'
            }
        })

        await fetchPendingAdmins()

    } catch (err) {
        console.error('Gagal verifikasi', err)
    }
}


const isLoaded = ref(false)

onMounted(async () => {
    await fetchDashboardData()

    if (userRole.value === 'super_admin') {
        await fetchPendingAdmins()
    }

    isLoaded.value = true
})
</script>
