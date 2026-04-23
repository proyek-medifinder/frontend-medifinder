<template>
    <aside
        class="sticky top-0 relative flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#0b5f58] text-white">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_45%)]" />

        <div class="relative flex h-full flex-col px-5 py-6">
            <div class="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur">
                <div class="flex items-center gap-3">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                        <Icon icon="solar:shield-keyhole-bold-duotone" class="h-7 w-7 text-white" />
                    </div>

                    <div>
                        <p class="text-xs uppercase tracking-[0.32em] text-emerald-100/80">
                            Admin Panel
                        </p>
                        <h1 class="text-lg font-semibold">
                            MediFinder
                        </h1>
                    </div>
                </div>

                <div class="mt-5 rounded-2xl bg-white/10 px-4 py-3">
                    <p class="text-xs text-emerald-50/75">
                        Akses aktif
                    </p>
                    <p class="mt-1 text-sm font-medium capitalize">
                        {{ roleLabel }}
                    </p>
                </div>
            </div>

            <nav class="relative mt-6 flex-1 space-y-6 pr-1">
                <div v-for="group in menuGroups" :key="group.title" class="space-y-2">
                    <p class="px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-100/60">
                        {{ group.title }}
                    </p>

                    <NuxtLink v-for="item in group.items" :key="item.to" :to="item.to"
                        class="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-emerald-50/85 transition hover:bg-white/12 hover:text-white"
                        :class="isActive(item.to) ? 'bg-white text-emerald-800 shadow-lg shadow-black/10' : ''">
                        <span class="flex h-10 w-10 items-center justify-center rounded-xl transition"
                            :class="isActive(item.to) ? 'bg-emerald-100 text-emerald-700' : 'bg-white/10 text-white group-hover:bg-white/15'">
                            <Icon :icon="item.icon" class="h-5 w-5" />
                        </span>
                        <span class="flex-1">
                            {{ item.label }}
                        </span>
                    </NuxtLink>
                </div>
            </nav>

            <div class="relative mt-4 rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-white text-base font-semibold text-emerald-700">
                        {{ userInitial }}
                    </div>

                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-semibold text-white">
                            {{ displayName }}
                        </p>
                        <p class="truncate text-xs capitalize text-emerald-50/70">
                            {{ roleLabel }}
                        </p>
                    </div>
                </div>

                <button @click="handleLogout"
                    class="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600">
                    <Icon icon="solar:logout-2-bold-duotone" class="h-5 w-5" />
                    Keluar
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

type MenuItem = {
    label: string
    to: string
    icon: string
}

type MenuGroup = {
    title: string
    items: MenuItem[]
}

const route = useRoute()
const { logout, user } = useAuth()
const { isSuperAdmin, isAdminApotek } = useRole()

const superAdminMenu = computed<MenuGroup[]>(() => [
    {
        title: 'Ringkasan',
        items: [
            { label: 'Dashboard', to: '/admin', icon: 'solar:widget-5-bold-duotone' }
        ]
    },
    {
        title: 'Manajemen',
        items: [
            { label: 'Admin Apotek', to: '/admin/adminapotek', icon: 'solar:user-id-bold-duotone' },
            { label: 'Daftar Apotek', to: '/admin/daftar-apotek', icon: 'solar:hospital-bold-duotone' },
            { label: 'Artikel', to: '/admin/artikel', icon: 'solar:document-text-bold-duotone' },
            { label: 'Riwayat Transaksi', to: '/admin/transaksi', icon: 'solar:wallet-money-bold-duotone' },
            { label: 'Kontak', to: '/admin/kontak', icon: 'solar:chat-round-dots-bold-duotone' }
        ]
    }
])

const adminApotekMenu = computed<MenuGroup[]>(() => [
    {
        title: 'Ringkasan',
        items: [
            { label: 'Dashboard', to: '/admin', icon: 'solar:chart-square-bold-duotone' }
        ]
    },
    {
        title: 'Operasional',
        items: [
            { label: 'Data Apotek', to: '/admin/data-apotek', icon: 'solar:hospital-bold-duotone' },
            { label: 'Data Obat', to: '/admin/data-obat', icon: 'solar:pills-3-bold-duotone' },
            { label: 'Pesanan Obat', to: '/admin/pesanan-obat', icon: 'solar:bag-smile-bold-duotone' }
        ]
    }
])

const menuGroups = computed(() => {
    if (isSuperAdmin.value) return superAdminMenu.value
    if (isAdminApotek.value) return adminApotekMenu.value
    return []
})

const displayName = computed(() => user.value?.name || 'Administrator')
const userInitial = computed(() => displayName.value.charAt(0).toUpperCase())
const roleLabel = computed(() => {
    if (isSuperAdmin.value) return 'super admin'
    if (isAdminApotek.value) return 'admin apotek'
    return user.value?.role || 'admin'
})

const isActive = (target: string) => {
    return route.path === target || (target !== '/admin' && route.path.startsWith(target))
}

const handleLogout = () => {
    logout()
}
</script>
