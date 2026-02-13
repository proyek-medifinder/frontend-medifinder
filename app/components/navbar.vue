<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from '#app'

const route = useRoute()

const mobileOpen = ref(false)
const dropdownOpen = ref(false)

const user = ref({
    name: "Admin",
    avatar: "/images/istri.png",
    loggedIn: true
})

const logout = () => {
    user.value.loggedIn = false
    dropdownOpen.value = false
}

const isActive = (path: string) => {
    return route.path === path
}

const cartOpen = ref(false)

const cartItems = ref([
    {
        id: 1,
        name: "Paracetamol 500mg",
        qty: 2
    },
    {
        id: 2,
        name: "Vitamin C 1000mg",
        qty: 1
    }
])

</script>

<template>
    <nav class="fixed top-0 left-0 right-0 z-50 py-4">
        <div class="max-w-7xl mx-auto px-4">

            <!-- NAVBAR PILL -->
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
                        <!-- CART -->
                        <div v-if="user.loggedIn" class="relative">

                            <button @click="cartOpen = !cartOpen"
                                class="relative p-2 rounded-full hover:bg-gray-100 transition">

                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-700" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13L5.4 5M16 21a1 1 0 100-2M8 21a1 1 0 100-2" />
                                </svg>

                                <!-- BADGE -->
                                <span v-if="cartItems.length"
                                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                                    {{ cartItems.length }}
                                </span>
                            </button>

                            <!-- CART DROPDOWN -->
                            <div v-if="cartOpen"
                                class="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border p-4">

                                <p class="font-semibold mb-3">Keranjang</p>

                                <div v-if="cartItems.length" class="space-y-2">
                                    <div v-for="item in cartItems" :key="item.id" class="flex justify-between text-sm">
                                        <span>{{ item.name }}</span>
                                        <span>x{{ item.qty }}</span>
                                    </div>
                                </div>

                                <div v-else class="text-sm text-gray-400">
                                    Keranjang kosong
                                </div>

                                <NuxtLink to="/keranjang"
                                    class="block mt-4 bg-emerald-600 text-white text-center py-2 rounded-lg text-sm">
                                    Lihat Semua Keranjang
                                </NuxtLink>

                            </div>
                        </div>

                        <!-- LOGIN -->
                        <NuxtLink v-if="!user.loggedIn" to="/login"
                            class="bg-[#0f766e] text-white px-5 py-2 rounded-full">
                            Login / Daftar
                        </NuxtLink>

                        <!-- PROFILE -->
                        <div v-else class="relative">
                            <button @click="dropdownOpen = !dropdownOpen" class="flex items-center gap-3">
                                <img :src="user.avatar" class="w-10 h-10 rounded-full object-cover border" />
                                <span class="font-medium text-gray-700">
                                    {{ user.name }}
                                </span>
                            </button>

                            <div v-if="dropdownOpen"
                                class="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border py-2">
                                <NuxtLink to="/profile" class="block px-4 py-2 text-sm hover:bg-gray-50">
                                    Profile
                                </NuxtLink>

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

                <!-- MOBILE MENU (INSIDE NAVBAR) -->
                <div v-if="mobileOpen"
                    class="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl shadow-md p-6 lg:hidden">
                    <ul class="flex flex-col gap-4 text-center font-medium">

                        <li>
                            <NuxtLink to="/" @click="mobileOpen = false"
                                :class="isActive('/') ? 'text-emerald-600 font-semibold' : 'text-gray-700'">
                                Kemitraan
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/katalog" @click="mobileOpen = false"
                                :class="isActive('/katalog') ? 'text-emerald-600 font-semibold' : 'text-gray-700'">
                                Katalog Produk
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/artikel" @click="mobileOpen = false"
                                :class="isActive('/artikel') ? 'text-emerald-600 font-semibold' : 'text-gray-700'">
                                Artikel
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/kontak" @click="mobileOpen = false"
                                :class="isActive('/kontak') ? 'text-emerald-600 font-semibold' : 'text-gray-700'">
                                Kontak Kami
                            </NuxtLink>
                        </li>

                        <!-- CART MOBILE -->
                        <li v-if="user.loggedIn" class="pt-4 border-t">
                            <button @click="cartOpen = !cartOpen"
                                class="w-full text-center font-semibold text-gray-700">
                                Keranjang ({{ cartItems.length }})
                            </button>

                            <div v-if="cartOpen" class="mt-3 bg-gray-50 rounded-xl p-3 text-sm">
                                <div v-if="cartItems.length">
                                    <div v-for="item in cartItems" :key="item.id" class="flex justify-between py-1">
                                        <span>{{ item.name }}</span>
                                        <span>x{{ item.qty }}</span>
                                    </div>
                                </div>

                                <div v-else class="text-gray-400 text-center">
                                    Keranjang kosong
                                </div>

                                <NuxtLink to="/keranjang" @click="mobileOpen = false"
                                    class="block mt-3 bg-emerald-600 text-white py-2 rounded-lg text-center">
                                    Lihat Semua Keranjang
                                </NuxtLink>
                            </div>
                        </li>


                        <!-- LOGIN -->
                        <li v-if="!user.loggedIn" class="pt-3">
                            <NuxtLink to="/login" class="block bg-emerald-500 text-white py-2 rounded-full">
                                Login / Daftar
                            </NuxtLink>
                        </li>

                        <!-- PROFILE -->
                        <li v-else class="pt-4 border-t">
                            <div class="flex flex-col items-center gap-3 pt-4">
                                <img :src="user.avatar" class="w-14 h-14 rounded-full object-cover border" />

                                <p class="font-semibold text-gray-800">
                                    {{ user.name }}
                                </p>

                                <NuxtLink to="/profile" class="text-sm text-gray-600 hover:text-emerald-600">
                                    Profile
                                </NuxtLink>

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
