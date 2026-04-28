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

/* 🔥 INIT */
onMounted(() => {
    fetchCart()
})

/* 🔥 FIX ASYNC USER */
watch(user, (val) => {
    if (val) fetchCart()
})
</script>

<template>
    <nav class="fixed top-0 left-0 right-0 z-50 py-4">
        <div class="max-w-7xl mx-auto px-4">

            <div
                class="relative bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] max-w-5xl mx-auto">

                <div class="flex items-center justify-between">

                    <!-- LOGO -->
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <img src="/images/Logo_remove.png" class="h-10" />
                    </NuxtLink>

                    <!-- DESKTOP MENU -->
                    <ul class="hidden lg:flex items-center gap-8 font-medium">
                        <li>
                            <NuxtLink to="/"
                                :class="isActive('/') ? 'text-emerald-600 underline underline-offset-8' : 'text-gray-700'">
                                Kemitraan
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/katalog"
                                :class="isActive('/katalog') ? 'text-emerald-600 underline underline-offset-8' : 'text-gray-700'">
                                Katalog Produk
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/artikel"
                                :class="isActive('/artikel') ? 'text-emerald-600 underline underline-offset-8' : 'text-gray-700'">
                                Artikel
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/kontak"
                                :class="isActive('/kontak') ? 'text-emerald-600 underline underline-offset-8' : 'text-gray-700'">
                                Kontak Kami
                            </NuxtLink>
                        </li>
                    </ul>

                    <!-- RIGHT -->
                    <div class="hidden lg:flex items-center gap-4">

                        <!-- CART -->
                        <div v-if="user" class="relative">
                            <button @click="cartOpen = !cartOpen"
                                class="relative p-2 rounded-full hover:bg-gray-100 transition cursor-pointer">

                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-700" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13L5.4 5M16 21a1 1 0 100-2M8 21a1 1 0 100-2" />
                                </svg>

                                <span v-if="cartItems.length"
                                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                                    {{ cartItems.length }}
                                </span>
                            </button>
                        </div>

                        <!-- LOGIN -->
                        <NuxtLink v-if="!user" to="/login" class="bg-[#0f766e] text-white px-5 py-2 rounded-full">
                            Login / Daftar
                        </NuxtLink>

                        <!-- PROFILE -->
                        <div v-if="user" class="relative ">
                            <button @click="dropdownOpen = !dropdownOpen"
                                class="flex items-center gap-3 cursor-pointer">

                                <img :src="user?.picture || '/images/istri.png'"
                                    class="w-10 h-10 rounded-full object-cover border" />

                                <span class="font-medium text-gray-700">
                                    {{ user?.name || 'User' }}
                                </span>
                            </button>

                            <!-- CART DROPDOWN -->
                            <div v-if="cartOpen"
                                class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-lg border p-4 z-50">

                                <h3 class="font-semibold text-gray-800 mb-3">
                                    Keranjang
                                </h3>

                                <!-- EMPTY -->
                                <div v-if="cartItems.length === 0" class="text-sm text-gray-400 text-center py-4">
                                    Keranjang kosong
                                </div>

                                <!-- ITEMS -->
                                <div v-else class="space-y-3 max-h-60 overflow-y-auto">

                                    <div v-for="item in cartItems" :key="item.item_id"
                                        class="flex justify-between items-center text-sm border-b pb-2">

                                        <div>
                                            <p class="font-medium text-gray-800">
                                                {{ item.nama }}
                                            </p>
                                            <p class="text-gray-500">
                                                Qty: {{ item.jumlah }}
                                            </p>
                                            <p class="text-xs text-gray-400">
                                                Rp {{ item.harga }}
                                            </p>
                                        </div>

                                        <button @click="removeItem(item.item_id)" class="text-red-500 text-xs">
                                            Hapus
                                        </button>

                                    </div>

                                </div>

                                <!-- ACTION -->
                                <div v-if="cartItems.length" class="mt-4 space-y-2">

                                    <div class="text-sm font-semibold text-gray-700 text-right">
                                        Total: Rp {{ cart?.total || 0 }}
                                    </div>

                                    <button @click="handleCheckout" :disabled="loadingCheckout"
                                        class="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 text-sm">
                                        {{ loadingCheckout ? 'Processing...' : 'Checkout' }}
                                        Checkout
                                    </button>

                                </div>

                            </div>

                            <div v-if="dropdownOpen"
                                class="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border py-2">

                                <button @click="goToProfile"
                                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                    Profil Saya
                                </button>

                                <button @click="logout"
                                    class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50">
                                    Logout
                                </button>
                            </div>
                        </div>

                    </div>

                    <!-- MOBILE BUTTON -->
                    <button class="lg:hidden z-50" @click="mobileOpen = !mobileOpen">
                        ☰
                    </button>

                </div>

                <!-- MOBILE MENU -->
                <div v-if="mobileOpen"
                    class="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl shadow-md p-6 lg:hidden">

                    <ul class="flex flex-col gap-4 text-center font-medium">

                        <li>
                            <NuxtLink to="/" @click="mobileOpen = false"
                                :class="isActive('/') ? 'text-[#0f766e] font-semibold' : 'text-gray-700'">
                                Kemitraan
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/katalog" @click="mobileOpen = false"
                                :class="isActive('/katalog') ? 'text-[#0f766e] font-semibold' : 'text-gray-700'">
                                Katalog Produk
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/artikel" @click="mobileOpen = false"
                                :class="isActive('/artikel') ? 'text-[#0f766e] font-semibold' : 'text-gray-700'">
                                Artikel
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/kontak" @click="mobileOpen = false"
                                :class="isActive('/kontak') ? 'text-[#0f766e] font-semibold' : 'text-gray-700'">
                                Kontak Kami
                            </NuxtLink>
                        </li>

                        <!-- CART MOBILE -->
                        <li v-if="user" class="pt-4 border-t">
                            <button @click="cartOpen = !cartOpen"
                                class="w-full text-center font-semibold text-gray-700">
                                Keranjang ({{ cartItems.length }})
                            </button>

                            <div v-if="cartOpen" class="mt-4 bg-gray-50 rounded-xl p-4">

                                <!-- EMPTY -->
                                <div v-if="cartItems.length === 0" class="text-sm text-gray-400 text-center py-4">
                                    Keranjang kosong
                                </div>

                                <!-- ITEMS -->
                                <div v-else class="space-y-3">

                                    <div v-for="item in cartItems" :key="item.item_id"
                                        class="flex justify-between items-center text-sm border-b pb-2">

                                        <div>
                                            <p class="font-medium text-gray-800">
                                                {{ item.nama }}
                                            </p>
                                            <p class="text-gray-500">
                                                Qty: {{ item.jumlah }}
                                            </p>
                                        </div>

                                        <button @click="removeItem(item.item_id)" class="text-red-500 text-xs">
                                            Hapus
                                        </button>

                                    </div>

                                </div>

                                <!-- TOTAL -->
                                <div v-if="cartItems.length" class="mt-3 text-right font-semibold">
                                    Total: Rp {{ cart?.total || 0 }}
                                </div>

                                <!-- BUTTON -->
                                <button v-if="cartItems.length" @click="handleCheckout"
                                    class="w-full mt-3 bg-emerald-600 text-white py-2 rounded-lg">
                                    Checkout
                                </button>

                            </div>
                        </li>


                        <!-- LOGIN MOBILE -->
                        <li v-if="!user" class="pt-3">
                            <NuxtLink to="/login" class="block bg-[#0f766e] text-white py-2 rounded-full">
                                Login / Daftar
                            </NuxtLink>
                        </li>

                        <!-- PROFILE MOBILE -->
                        <li v-if="user" class="pt-4 border-t">
                            <div class="flex flex-col items-center gap-3 pt-4">
                                <img :src="user?.picture || '/images/istri.png'"
                                    class="w-14 h-14 rounded-full object-cover border" />

                                <p class="font-semibold text-gray-800">
                                    {{ user?.name }}
                                </p>

                                <button @click="goToProfile" class="text-sm text-gray-600 hover:text-[#0f766e]">
                                    Profil Saya
                                </button>

                                <button @click="logout" class="text-sm text-red-500 hover:text-red-600">
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
