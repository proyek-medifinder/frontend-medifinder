<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const router = useRouter()

const mobileOpen = ref(false)
const dropdownOpen = ref(false)
const cartOpen = ref(false)

const { user, logout } = useAuth()

const isActive = (path: string) => route.path === path

const { cart, fetchCart, removeItem, checkout } = useCart()

const cartItems = computed(() => cart.value?.items || [])

const loadingCheckout = ref(false)
const userAvatar = computed(() => user.value?.picture || '')
const userAvatarFailed = ref(false)

const goToProfile = async () => {
    dropdownOpen.value = false
    mobileOpen.value = false
    cartOpen.value = false
    await router.push('/profile')
}

const handleCheckout = async () => {
    loadingCheckout.value = true

    const res = await checkout()

    loadingCheckout.value = false

    if (!res?.redirect_url) {
        alert("Checkout gagal")
    }
}


const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleDarkMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
    fetchCart()
})

watch(user, (val) => {
    if (val) fetchCart()
})


</script>

<template>
    <nav class="fixed top-0 left-0 right-0 z-50 py-4">
        <div class="max-w-7xl mx-auto px-4">

            <!-- NAVBAR PILL CONTAINER -->
            <div
                class="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] border border-transparent dark:border-slate-800 max-w-5xl mx-auto transition-colors duration-300">

                <div class="flex items-center justify-between">

                    <!-- LOGO -->
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <img src="/images/Logo_remove.png" class="h-10" alt="MediFinder Logo" />
                    </NuxtLink>

                    <!-- DESKTOP MENU -->
                    <ul class="hidden lg:flex items-center gap-8 font-medium">
                        <li>
                            <NuxtLink to="/"
                                :class="isActive('/') ? 'text-emerald-600 dark:text-emerald-400 underline underline-offset-8 font-semibold' : 'text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'">
                                Kemitraan
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/katalog"
                                :class="isActive('/katalog') ? 'text-emerald-600 dark:text-emerald-400 underline underline-offset-8 font-semibold' : 'text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'">
                                Katalog Produk
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/artikel"
                                :class="isActive('/artikel') ? 'text-emerald-600 dark:text-emerald-400 underline underline-offset-8 font-semibold' : 'text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'">
                                Artikel
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/kontak"
                                :class="isActive('/kontak') ? 'text-emerald-600 dark:text-emerald-400 underline underline-offset-8 font-semibold' : 'text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'">
                                Kontak Kami
                            </NuxtLink>
                        </li>
                    </ul>

                    <!-- RIGHT -->
                    <div class="hidden lg:flex items-center gap-4">

                        <!-- CART BUTTON -->
                        <div v-if="user" class="relative">
                            <button @click="cartOpen = !cartOpen"
                                class="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                aria-label="Buka Keranjang">

                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 text-gray-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13L5.4 5M16 21a1 1 0 100-2M8 21a1 1 0 100-2" />
                                </svg>

                                <span v-if="cartItems.length"
                                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full font-bold shadow">
                                    {{ cartItems.length }}
                                </span>
                            </button>
                        </div>

                        <!-- LOGIN -->
                        <NuxtLink v-if="!user" to="/login"
                            class="bg-[#0f766e] dark:bg-emerald-600 hover:bg-[#0d655e] dark:hover:bg-emerald-500 text-white px-5 py-2 rounded-full font-medium transition-colors shadow">
                            Login / Daftar
                        </NuxtLink>

                        <!-- PROFILE -->
                        <div v-if="user" class="relative">
                            <button @click="dropdownOpen = !dropdownOpen"
                                class="flex items-center gap-3 cursor-pointer select-none">

                                <img v-if="userAvatar && !userAvatarFailed" :src="userAvatar"
                                    referrerpolicy="no-referrer" crossorigin="anonymous"
                                    @error="userAvatarFailed = true"
                                    class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                                <img v-else src="/images/profile.png"
                                    class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />

                                <span class="font-medium text-gray-700 dark:text-slate-200">
                                    {{ user?.name || 'User' }}
                                </span>
                            </button>

                            <!-- CART DROPDOWN -->
                            <div v-if="cartOpen"
                                class="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 transition-all">

                                <h3
                                    class="font-semibold text-gray-800 dark:text-slate-100 mb-3 flex items-center justify-between">
                                    <span>Keranjang Belanja</span>
                                    <span class="text-xs text-slate-400">({{ cartItems.length }} item)</span>
                                </h3>

                                <!-- EMPTY -->
                                <div v-if="cartItems.length === 0"
                                    class="text-sm text-gray-400 dark:text-slate-500 text-center py-6">
                                    Keranjang masih kosong
                                </div>

                                <!-- ITEMS -->
                                <div v-else class="space-y-3 max-h-60 overflow-y-auto pr-1">
                                    <div v-for="item in cartItems" :key="item.item_id"
                                        class="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">

                                        <div>
                                            <p class="font-medium text-gray-800 dark:text-slate-200">
                                                {{ item.nama }}
                                            </p>
                                            <p class="text-gray-500 dark:text-slate-400 text-xs">
                                                Qty: {{ item.jumlah }}
                                            </p>
                                            <p
                                                class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                                                Rp {{ item.harga }}
                                            </p>
                                        </div>

                                        <button @click="removeItem(item.item_id)"
                                            class="text-red-500 dark:text-red-400 hover:text-red-600 text-xs font-medium cursor-pointer">
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <!-- ACTION -->
                                <div v-if="cartItems.length"
                                    class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                    <div class="text-sm font-semibold text-gray-700 dark:text-slate-200 text-right">
                                        Total: <span class="text-emerald-600 dark:text-emerald-400">Rp {{ cart?.total ||
                                            0 }}</span>
                                    </div>

                                    <button @click="handleCheckout" :disabled="loadingCheckout"
                                        class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer shadow disabled:opacity-50">
                                        {{ loadingCheckout ? 'Memproses...' : 'Checkout Sekarang' }}
                                    </button>
                                </div>
                            </div>

                            <!-- PROFILE DROPDOWN -->
                            <div v-if="dropdownOpen"
                                class="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">

                                <button @click="goToProfile"
                                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    Profil Saya
                                </button>

                                <button @click="logout"
                                    class="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer">
                                    Logout
                                </button>
                            </div>
                        </div>

                        <!-- TOMBOL SWITCH DARK/LIGHT MODE DESKTOP -->
                        <button type="button" @click="toggleDarkMode"
                            class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            :title="isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'"
                            aria-label="Toggle Dark Mode">

                            <!-- Ikon Matahari (Dark Mode Aktif) -->
                            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-400"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="4"></circle>
                                <path d="M12 2v2"></path>
                                <path d="M12 20v2"></path>
                                <path d="m4.93 4.93 1.41 1.41"></path>
                                <path d="m17.66 17.66 1.41 1.41"></path>
                                <path d="M2 12h2"></path>
                                <path d="M20 12h2"></path>
                                <path d="m6.34 17.66-1.41 1.41"></path>
                                <path d="m19.07 4.93-1.41 1.41"></path>
                            </svg>

                            <!-- Ikon Bulan (Light Mode Aktif) -->
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-700"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            </svg>
                        </button>

                    </div>

                    <!-- MOBILE ACTIONS (DARK TOGGLE & HAMBURGER BUTTON) -->
                    <div class="lg:hidden flex items-center gap-2">
                        <!-- Toggle Dark Mode Mobile -->
                        <button type="button" @click="toggleDarkMode"
                            class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            :title="isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'"
                            aria-label="Toggle Dark Mode">
                            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-400"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="4"></circle>
                                <path d="M12 2v2"></path>
                                <path d="M12 20v2"></path>
                                <path d="m4.93 4.93 1.41 1.41"></path>
                                <path d="m17.66 17.66 1.41 1.41"></path>
                                <path d="M2 12h2"></path>
                                <path d="M20 12h2"></path>
                                <path d="m6.34 17.66-1.41 1.41"></path>
                                <path d="m19.07 4.93-1.41 1.41"></path>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-700"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            </svg>
                        </button>

                        <button class="p-2 text-slate-700 dark:text-slate-200 text-xl cursor-pointer"
                            @click="mobileOpen = !mobileOpen" aria-label="Menu Mobile">
                            {{ mobileOpen ? '✕' : '☰' }}
                        </button>
                    </div>

                </div>

                <!-- MOBILE MENU DROPDOWN -->
                <div v-if="mobileOpen"
                    class="absolute left-0 right-0 top-full mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 lg:hidden transition-all">

                    <ul class="flex flex-col gap-4 text-center font-medium">

                        <li>
                            <NuxtLink to="/" @click="mobileOpen = false"
                                :class="isActive('/') ? 'text-[#0f766e] dark:text-emerald-400 font-semibold' : 'text-gray-700 dark:text-slate-300'">
                                Kemitraan
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/katalog" @click="mobileOpen = false"
                                :class="isActive('/katalog') ? 'text-[#0f766e] dark:text-emerald-400 font-semibold' : 'text-gray-700 dark:text-slate-300'">
                                Katalog Produk
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/artikel" @click="mobileOpen = false"
                                :class="isActive('/artikel') ? 'text-[#0f766e] dark:text-emerald-400 font-semibold' : 'text-gray-700 dark:text-slate-300'">
                                Artikel
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/kontak" @click="mobileOpen = false"
                                :class="isActive('/kontak') ? 'text-[#0f766e] dark:text-emerald-400 font-semibold' : 'text-gray-700 dark:text-slate-300'">
                                Kontak Kami
                            </NuxtLink>
                        </li>

                        <!-- CART MOBILE -->
                        <li v-if="user" class="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button @click="cartOpen = !cartOpen"
                                class="w-full text-center font-semibold text-gray-700 dark:text-slate-200 cursor-pointer">
                                Keranjang ({{ cartItems.length }})
                            </button>

                            <div v-if="cartOpen"
                                class="mt-4 bg-gray-50 dark:bg-slate-800/70 rounded-xl p-4 border border-slate-200 dark:border-slate-700">

                                <!-- EMPTY -->
                                <div v-if="cartItems.length === 0"
                                    class="text-sm text-gray-400 dark:text-slate-400 text-center py-4">
                                    Keranjang masih kosong
                                </div>

                                <!-- ITEMS -->
                                <div v-else class="space-y-3">
                                    <div v-for="item in cartItems" :key="item.item_id"
                                        class="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-700 pb-2">

                                        <div class="text-left">
                                            <p class="font-medium text-gray-800 dark:text-slate-200">
                                                {{ item.nama }}
                                            </p>
                                            <p class="text-gray-500 dark:text-slate-400 text-xs">
                                                Qty: {{ item.jumlah }}
                                            </p>
                                        </div>

                                        <button @click="removeItem(item.item_id)"
                                            class="text-red-500 dark:text-red-400 text-xs font-semibold cursor-pointer">
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <!-- TOTAL -->
                                <div v-if="cartItems.length"
                                    class="mt-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                                    Total: <span class="text-emerald-600 dark:text-emerald-400">Rp {{ cart?.total || 0
                                        }}</span>
                                </div>

                                <!-- BUTTON -->
                                <button v-if="cartItems.length" @click="handleCheckout" :disabled="loadingCheckout"
                                    class="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer">
                                    {{ loadingCheckout ? 'Memproses...' : 'Checkout' }}
                                </button>
                            </div>
                        </li>

                        <!-- LOGIN MOBILE -->
                        <li v-if="!user" class="pt-3">
                            <NuxtLink to="/login"
                                class="block bg-[#0f766e] dark:bg-emerald-600 text-white py-2 rounded-full font-medium">
                                Login / Daftar
                            </NuxtLink>
                        </li>

                        <!-- PROFILE MOBILE -->
                        <li v-if="user" class="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <div class="flex flex-col items-center gap-3 pt-4">
                                <img v-if="userAvatar && !userAvatarFailed" :src="userAvatar"
                                    referrerpolicy="no-referrer" crossorigin="anonymous"
                                    @error="userAvatarFailed = true"
                                    class="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow" />
                                <img v-else src="/images/profile.png"
                                    class="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow" />

                                <p class="font-semibold text-gray-800 dark:text-slate-200">
                                    {{ user?.name }}
                                </p>

                                <button @click="goToProfile"
                                    class="text-sm text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                                    Profil Saya
                                </button>

                                <button @click="logout"
                                    class="text-sm text-red-500 dark:text-red-400 hover:text-red-600">
                                    Logout
                                </button>
                            </div>
                        </li>

                    </ul>
                </div>

            </div>
        </div>
    </nav>
</template>
