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
                        Ringkasan operasional harian apotekmu, dari status toko sampai pergerakan pesanan dan stok obat.
                    </h2>
                    <p class="mt-4 max-w-2xl text-sm text-emerald-50/85">
                        Semua kartu, grafik, dan daftar pesanan di bawah ini sudah mengikuti data apotek, obat, dan transaksi yang tersambung ke API.
                    </p>
                </div>

                <div class="grid gap-3 rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-emerald-50/75">Status apotek</span>
                        <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="apotekStatusBadgeClass">
                            {{ apotekStatusLabel }}
                        </span>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="rounded-2xl bg-white/10 p-4">
                            <p class="text-xs text-emerald-50/70">Pesanan perlu diproses</p>
                            <p class="mt-2 text-2xl font-semibold">{{ totalPendingOrders }}</p>
                        </div>
                        <div class="rounded-2xl bg-white/10 p-4">
                            <p class="text-xs text-emerald-50/70">Stok kritis</p>
                            <p class="mt-2 text-2xl font-semibold">{{ criticalMedicines }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard title="Pesanan Masuk" :value="totalOrders" icon="solar:bag-smile-bold-duotone" badge="Data live"
                description="Total transaksi yang tercatat" icon-class="bg-cyan-50 text-cyan-700"
                badge-class="bg-cyan-50 text-cyan-700" />
            <AdminMetricCard title="Omzet Masuk" :value="formattedRevenue" icon="solar:wallet-money-bold-duotone"
                badge="Total transaksi" description="Akumulasi dari data pesanan" />
            <AdminMetricCard title="Obat Aktif" :value="totalMedicines" icon="solar:pills-3-bold-duotone" badge="Katalog apotek"
                description="Produk tersedia di etalase" icon-class="bg-amber-50 text-amber-700"
                badge-class="bg-amber-50 text-amber-700" />
            <AdminMetricCard title="Stok Menipis" :value="lowMedicines" icon="solar:danger-triangle-bold-duotone"
                badge="Perlu restock" description="Obat dengan stok 30 ke bawah"
                icon-class="bg-rose-50 text-rose-700" badge-class="bg-rose-50 text-rose-700" />
        </section>

        <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <AdminTrendChart title="Tren Pesanan Terbaru" subtitle="Distribusi transaksi dalam 6 waktu terakhir"
                :values="orderTrendValues" :labels="orderTrendLabels"
                :summary="orderTrendSummary" />

            <AdminBarChart title="Sebaran Kondisi Stok" subtitle="Ringkasan kondisi inventori apotek saat ini"
                :values="stockDistributionValues" :labels="['Aman', 'Rendah', 'Kritis']"
                :summary="stockDistributionSummary" />
        </section>

        <section>
            <div
                class="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900">Pesanan Terbaru</h3>
                        <p class="mt-1 text-sm text-slate-500">
                            Ringkasan transaksi terbaru yang masuk ke apotekmu.
                        </p>
                    </div>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {{ apotekOrders.length }} transaksi terbaru
                    </span>
                </div>

                <div v-if="apotekOrders.length === 0"
                    class="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">
                    Belum ada pesanan yang tercatat untuk apotek ini.
                </div>

                <div v-else class="mt-5 space-y-4">
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
                            Semua angka di bagian ini ditarik dari data admin, apotek, pengajuan, dan pesan kontak yang aktif di sistem.
                        </p>
                    </div>

                    <div class="grid gap-4 self-start rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur xl:ml-4">
                        <p class="text-sm text-emerald-50/70">Snapshot minggu ini</p>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="rounded-2xl bg-white/10 px-4 py-5">
                                <p class="text-xs text-emerald-50/70">Pengajuan minggu ini</p>
                                <p class="mt-2 text-2xl font-semibold">{{ newPendingThisWeek }}</p>
                            </div>
                            <div class="rounded-2xl bg-white/10 px-4 py-5">
                                <p class="text-xs text-emerald-50/70">Admin aktif</p>
                                <p class="mt-2 text-2xl font-semibold">{{ approvedAdminCount }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <AdminMetricCard title="Total Admin" :value="loading ? '...' : totalAdmin" icon="solar:user-id-bold-duotone"
                    :badge="`${approvedAdminCount} aktif`" description="Akun admin apotek terdaftar" />
                <AdminMetricCard title="Total Apotek" :value="totalApotek" icon="solar:hospital-bold-duotone"
                    :badge="`${scheduledApotekCount} punya jam operasional`" description="Jaringan apotek yang sudah tersimpan"
                    icon-class="bg-cyan-50 text-cyan-700" badge-class="bg-cyan-50 text-cyan-700" />
                <AdminMetricCard title="Perlu Review" :value="pendingAdmins.length" icon="solar:clipboard-check-bold-duotone"
                    :badge="`${newPendingThisWeek} minggu ini`" description="Pengajuan menunggu keputusan"
                    icon-class="bg-rose-50 text-rose-700" badge-class="bg-rose-50 text-rose-700" />
                <AdminMetricCard title="Pesan Kontak" :value="totalKontak" icon="solar:chat-round-dots-bold-duotone" :badge="contactBadgeText"
                    description="Pesan masuk yang tercatat" icon-class="bg-amber-50 text-amber-700"
                    badge-class="bg-amber-50 text-amber-700" />
            </section>

            <section class="grid gap-7 xl:grid-cols-[1.2fr_0.8fr]">
                <AdminTrendChart title="Tren Aktivitas Platform" subtitle="Akumulasi admin, apotek, pengajuan, dan kontak baru dalam 6 bulan terakhir"
                    :values="superAdminTrendValues" :labels="superAdminTrendLabels"
                    :summary="superAdminTrendSummary" />
                <AdminBarChart title="Komposisi Operasional" subtitle="Distribusi status utama yang sedang dipantau"
                    :values="superAdminCompositionValues"
                    :labels="['Admin Aktif', 'Admin Suspend', 'Pengajuan', 'Kontak']" :summary="superAdminCompositionSummary" />
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
const totalApotek = ref(0)
const loading = ref(true)

const userRole = ref('')
const apotekOrders = ref<any[]>([])
const apotekProfile = ref<any | null>(null)
const apotekMedicines = ref<any[]>([])
const apotekTransactions = ref<any[]>([])
const superAdminList = ref<any[]>([])
const superApotekList = ref<any[]>([])
const superContactList = ref<any[]>([])

const totalOrders = computed(() => apotekTransactions.value.length)
const totalPendingOrders = computed(() =>
    apotekTransactions.value.filter((item: any) => item.status === 'pending').length
)
const totalRevenue = computed(() =>
    apotekTransactions.value
        .filter((item: any) => item.status === 'paid')
        .reduce((sum: number, item: any) => sum + Number(item.total || 0), 0)
)
const formattedRevenue = computed(() =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(totalRevenue.value)
)
const totalMedicines = computed(() => apotekMedicines.value.length)
const lowMedicines = computed(() =>
    apotekMedicines.value.filter((item: any) => Number(item.stok || 0) <= 30).length
)
const criticalMedicines = computed(() =>
    apotekMedicines.value.filter((item: any) => Number(item.stok || 0) <= 10).length
)
const safeMedicines = computed(() =>
    apotekMedicines.value.filter((item: any) => Number(item.stok || 0) > 30).length
)

const stockDistributionValues = computed(() => [
    safeMedicines.value,
    Math.max(lowMedicines.value - criticalMedicines.value, 0),
    criticalMedicines.value
])

const stockDistributionSummary = computed(() =>
    `${criticalMedicines.value} item butuh perhatian cepat`
)

const orderTrendSource = computed(() => apotekTransactions.value.slice(0, 6).reverse())
const orderTrendValues = computed(() => {
    const values = orderTrendSource.value.map((item: any) => Number(item.total || 0))
    return values.length ? values : [0]
})
const orderTrendLabels = computed(() => {
    const labels = orderTrendSource.value.map((item: any) =>
        new Date(item.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short'
        })
    )
    return labels.length ? labels : ['-']
})
const orderTrendSummary = computed(() => {
    if (!apotekTransactions.value.length) return 'Belum ada transaksi'
    return `${apotekTransactions.value.length} transaksi tercatat`
})

const currentTimeMinutes = computed(() => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
})

const toMinutes = (time?: string | null) => {
    if (!time) return null
    const [hours, minutes] = time.slice(0, 5).split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    return hours * 60 + minutes
}

const apotekStatusLabel = computed(() => {
    const openMinutes = toMinutes(apotekProfile.value?.jam_buka)
    const closeMinutes = toMinutes(apotekProfile.value?.jam_tutup)

    if (openMinutes === null || closeMinutes === null) return 'Jadwal belum diatur'
    return currentTimeMinutes.value >= openMinutes && currentTimeMinutes.value <= closeMinutes ? 'Buka' : 'Tutup'
})

const apotekStatusBadgeClass = computed(() => {
    if (apotekStatusLabel.value === 'Buka') {
        return 'bg-emerald-100 text-emerald-700'
    }
    if (apotekStatusLabel.value === 'Tutup') {
        return 'bg-rose-100 text-rose-700'
    }
    return 'bg-amber-100 text-amber-700'
})

const pendingAdmins = ref<any[]>([])
const selectedAdmin = ref<any | null>(null)
const showModal = ref(false)

const approvedAdminCount = computed(() =>
    superAdminList.value.filter((item: any) => normalizeStatus(item?.status) === 'approved').length
)

const suspendedAdminCount = computed(() =>
    superAdminList.value.filter((item: any) => normalizeStatus(item?.status) === 'suspended').length
)

const scheduledApotekCount = computed(() =>
    superApotekList.value.filter((item: any) => item.jam_buka && item.jam_tutup).length
)

const totalKontak = computed(() => superContactList.value.length)

const unresolvedKontak = computed(() =>
    superContactList.value.filter((item: any) => {
        const status = normalizeStatus(item?.status)
        return status !== 'resolved' && status !== 'done' && status !== 'closed'
    }).length
)

const contactBadgeText = computed(() =>
    unresolvedKontak.value > 0
        ? `${unresolvedKontak.value} belum ditindak`
        : 'Semua sudah ditinjau'
)

const normalizeListResponse = (response: any) => {
    if (Array.isArray(response?.data)) return response.data
    if (Array.isArray(response?.data?.data)) return response.data.data
    if (Array.isArray(response)) return response
    return []
}

const normalizeTotalCount = (response: any, fallbackLength: number) => {
    const candidates = [
        response?.meta?.total,
        response?.meta?.count,
        response?.data?.meta?.total,
        response?.data?.meta?.count,
        response?.total,
        response?.count
    ]

    for (const value of candidates) {
        const numeric = Number(value)
        if (Number.isFinite(numeric) && numeric >= 0) {
            return numeric
        }
    }

    return fallbackLength
}

const normalizeStatus = (value: unknown) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')

const getDateField = (item: any) =>
    item?.created_at ||
    item?.createdAt ||
    item?.submitted_at ||
    item?.updated_at ||
    item?.tanggal ||
    item?.date ||
    null

const isWithinDays = (value: string | null | undefined, days: number) => {
    if (!value) return false
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return false
    const diff = Date.now() - date.getTime()
    return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

const newPendingThisWeek = computed(() =>
    pendingAdmins.value.filter((item: any) => isWithinDays(getDateField(item), 7)).length
)

const getLastSixMonths = () => {
    const months: { key: string, label: string }[] = []
    const base = new Date()
    base.setDate(1)

    for (let index = 5; index >= 0; index--) {
        const current = new Date(base.getFullYear(), base.getMonth() - index, 1)
        months.push({
            key: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`,
            label: current.toLocaleDateString('id-ID', { month: 'short' })
        })
    }

    return months
}

const monthlyGrowthOverview = computed(() => {
    const months = getLastSixMonths()
    const values = months.map(({ key }) => {
        const adminsCreated = superAdminList.value.filter((item: any) =>
            String(getDateField(item) || '').slice(0, 7) === key
        ).length
        const apoteksCreated = superApotekList.value.filter((item: any) =>
            String(getDateField(item) || '').slice(0, 7) === key
        ).length
        const pengajuanCreated = pendingAdmins.value.filter((item: any) =>
            String(getDateField(item) || '').slice(0, 7) === key
        ).length
        const kontakCreated = superContactList.value.filter((item: any) =>
            String(getDateField(item) || '').slice(0, 7) === key
        ).length

        return adminsCreated + apoteksCreated + pengajuanCreated + kontakCreated
    })

    return {
        labels: months.map(item => item.label),
        values
    }
})

const superAdminTrendLabels = computed(() => monthlyGrowthOverview.value.labels)
const superAdminTrendValues = computed(() =>
    monthlyGrowthOverview.value.values.some(value => value > 0)
        ? monthlyGrowthOverview.value.values
        : [0, 0, 0, 0, 0, 0]
)
const superAdminTrendSummary = computed(() => {
    const totalNew = monthlyGrowthOverview.value.values.reduce((sum, value) => sum + value, 0)
    return totalNew > 0
        ? `${totalNew} aktivitas baru dalam 6 bulan`
        : 'Belum ada aktivitas tercatat'
})

const superAdminCompositionValues = computed(() => [
    approvedAdminCount.value,
    suspendedAdminCount.value,
    pendingAdmins.value.length,
    unresolvedKontak.value
])

const superAdminCompositionSummary = computed(() => {
    if (pendingAdmins.value.length > 0) {
        return `${pendingAdmins.value.length} pengajuan perlu ditinjau`
    }

    if (unresolvedKontak.value > 0) {
        return `${unresolvedKontak.value} pesan belum selesai`
    }

    return 'Pemantauan inti terkendali'
})

const fetchApotekOrders = async () => {
    try {
        const res: any = await $fetch(
            `${config.public.apiBase}/admin/transaksi`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                query: {
                    page: 1,
                    limit: 100
                }
            }
        )

        apotekTransactions.value = res.data || []

        apotekOrders.value = apotekTransactions.value.slice(0, 5).map((item: any) => ({
            id: item.id,
            customer: item.user_id?.slice(0, 8) || 'Pelanggan',
            items: `Pesanan ${item.id.slice(0, 10)}`,
            time: formatTime(item.created_at),
            total: new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(Number(item.total || 0)),
            note: getNote(item.status),
            status: item.status,
            badgeClass: getBadge(item.status)
        }))

    } catch (err) {
        console.error('Gagal fetch transaksi', err)
    }
}

const getBadge = (status: string) => {
    switch (status) {
        case 'paid':
            return 'bg-emerald-50 text-emerald-700'
        case 'pending':
            return 'bg-sky-50 text-sky-700'
        case 'cancelled':
            return 'bg-slate-100 text-slate-600'
        case 'failed':
            return 'bg-rose-50 text-rose-700'
        default:
            return 'bg-slate-100 text-slate-600'
    }
}

const getNote = (status: string) => {
    switch (status) {
        case 'paid':
            return 'Siap diproses'
        case 'pending':
            return 'Menunggu pembayaran'
        case 'cancelled':
            return 'Dibatalkan'
        case 'failed':
            return 'Pembayaran gagal'
        default:
            return '-'
    }
}

const formatTime = (date: string) => {
        return new Date(date).toLocaleString('id-ID')
}

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
            await fetchSuperAdminOverview()
        }

        if (userRole.value === 'admin_apotek') {
            const [apotekRes, obatRes] = await Promise.all([
                $fetch<any>(`${config.public.apiBase}/admin/apotek`, {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }),
                $fetch<any>(`${config.public.apiBase}/admin/obat`, {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                })
            ])

            apotekProfile.value = apotekRes?.data || null
            apotekMedicines.value = (obatRes?.data || []).map((item: any) => ({
                id: item.ID,
                nama: item.Nama,
                stok: Number(item.Stok || 0),
                harga: Number(item.Harga || 0)
            }))
        }
    } catch (err) {
        console.error('Gagal ambil data user', err)
    } finally {
        loading.value = false
    }
}

const fetchSuperAdminOverview = async () => {
    try {
        const results = await Promise.allSettled([
            $fetch<any>(`${config.public.apiBase}/superadmin/admin`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }),
            $fetch<any>(`${config.public.apiBase}/superadmin/apotek`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }),
            $fetch<any>(`${config.public.apiBase}/superadmin/pengajuan`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }),
            $fetch<any>(`${config.public.apiBase}/superadmin/kontak`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })
        ])

        const [adminResult, apotekResult, pendingResult, kontakResult] = results

        if (adminResult.status === 'fulfilled') {
            superAdminList.value = normalizeListResponse(adminResult.value)
            totalAdmin.value = normalizeTotalCount(adminResult.value, superAdminList.value.length)
        } else {
            console.error('Gagal ambil data admin apotek', adminResult.reason)
            superAdminList.value = []
            totalAdmin.value = 0
        }

        if (apotekResult.status === 'fulfilled') {
            superApotekList.value = normalizeListResponse(apotekResult.value)
            totalApotek.value = normalizeTotalCount(apotekResult.value, superApotekList.value.length)
        } else {
            console.error('Gagal ambil daftar apotek', apotekResult.reason)
            superApotekList.value = []
            totalApotek.value = 0
        }

        if (pendingResult.status === 'fulfilled') {
            pendingAdmins.value = normalizeListResponse(pendingResult.value)
        } else {
            console.error('Gagal ambil data pengajuan', pendingResult.reason)
            pendingAdmins.value = []
        }

        if (kontakResult.status === 'fulfilled') {
            superContactList.value = normalizeListResponse(kontakResult.value)
        } else {
            console.error('Gagal ambil data kontak', kontakResult.reason)
            superContactList.value = []
        }
    } catch (err) {
        console.error('Gagal ambil overview super admin', err)
    }
}

const fetchPendingAdmins = async () => {
    await fetchSuperAdminOverview()
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

        await fetchSuperAdminOverview()

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

    // 🔥 TAMBAH INI
    if (userRole.value === 'admin_apotek') {
        await fetchApotekOrders()
    }

    isLoaded.value = true
})
</script>
