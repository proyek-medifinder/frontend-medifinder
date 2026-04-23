<template>
    <header class="border-b border-slate-200/70 bg-white/80 px-6 py-5 backdrop-blur">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600/70">
                    {{ roleLabel }}
                </p>
                <h1 class="mt-1 text-2xl font-semibold text-slate-900">
                    {{ pageTitle }}
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    {{ pageDescription }}
                </p>
            </div>

            <div class="flex items-center gap-3 self-start rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div>
                    <p class="text-right text-sm font-semibold text-slate-800">
                        {{ loading ? 'Memuat...' : userName }}
                    </p>
                    <p class="text-right text-xs capitalize text-slate-500">
                        {{ userRole }}
                    </p>
                </div>

                <div
                    class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-100 to-amber-100 font-semibold text-emerald-700">
                    {{ userInitial }}
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const token = useCookie<string | null>('auth_token')

const userName = ref('')
const userRole = ref('')
const loading = ref(true)

const routeMeta: Record<string, { title: string, description: string }> = {
    '/admin': {
        title: 'Dashboard',
        description: 'Pantau performa, aktivitas, dan prioritas terbaru dari panel admin.'
    },
    '/admin/adminapotek': {
        title: 'Admin Apotek',
        description: 'Kelola akun admin apotek dan tinjau status operasionalnya.'
    },
    '/admin/daftar-apotek': {
        title: 'Daftar Apotek',
        description: 'Lihat jaringan apotek yang aktif beserta status layanannya.'
    },
    '/admin/artikel': {
        title: 'Artikel',
        description: 'Atur konten edukasi dan publikasi yang tampil untuk pengguna.'
    },
    '/admin/transaksi': {
        title: 'Riwayat Transaksi',
        description: 'Ringkas transaksi, pendapatan, dan tren pemesanan.'
    },
    '/admin/kontak': {
        title: 'Kontak',
        description: 'Tinjau pesan masuk dan tindak lanjuti pertanyaan pengguna.'
    },
    '/admin/data-apotek': {
        title: 'Data Apotek',
        description: 'Kelola profil apotek, jam operasional, dan status pelayanan.'
    },
    '/admin/data-obat': {
        title: 'Data Obat',
        description: 'Pantau stok, kategori, dan obat prioritas untuk penjualan.'
    },
    '/admin/pesanan-obat': {
        title: 'Pesanan Obat',
        description: 'Prioritaskan pesanan baru dan awasi alur pemenuhan pesanan.'
    }
}

const currentMeta = computed(() => routeMeta[route.path] || routeMeta['/admin'])
const pageTitle = computed(() => currentMeta.value.title)
const pageDescription = computed(() => currentMeta.value.description)
const roleLabel = computed(() => (userRole.value || 'admin').replace('_', ' '))
const userInitial = computed(() => (userName.value || 'A').charAt(0).toUpperCase())

const fetchUser = async () => {
    try {
        const res = await $fetch<any>(`${config.public.apiBase}/me`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            }
        })

        userName.value = res.data.name
        userRole.value = res.data.role

    } catch (err) {
        console.error('Gagal ambil user', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchUser()
})
</script>
