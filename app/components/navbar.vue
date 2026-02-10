<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const mobileOpen = ref(false)

const isActive = (path: string) =>
    computed(() => route.path === path)
</script>

<template>
    <nav class="fixed top-0 left-0 right-0 z-50 bg-transparent py-4">
        <div class="max-w-7xl mx-auto px-4">

            <!-- PILL -->
            <div class="bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] max-w-5xl mx-auto">
                <div class="flex items-center justify-between">

                    <!-- LOGO -->
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <img src="/images/Logo_remove.png" alt="MediFinder" class="h-15 w-auto" />
                    </NuxtLink>

                    <!-- DESKTOP MENU -->
                    <ul class="hidden lg:flex items-center gap-8 text-base font-medium">

                        <li>
                            <NuxtLink to="/" class="hover:text-[#0f766e]" :class="route.path === '/' ? 'text-[#0f766e] underline underline-offset-8'
                                : 'text-gray-700'">
                                Kemitraan
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/katalog" class="hover:text-[#0f766e]"
                                :class="route.path === '/katalog' ? 'text-emerald-600 underline underline-offset-8' : 'text-gray-700'">
                                Katalog Produk
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/artikel" class="hover:text-[#0f766e]"
                                :class="route.path === '/artikel' ? 'text-emerald-600 underline underline-offset-8' : 'text-gray-700'">
                                Artikel
                            </NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/kontak" class="hover:text-[#0f766e]"
                                :class="route.path === '/kontak' ? 'text-emerald-600 underline underline-offset-8' : 'text-gray-700'">
                                Kontak Kami
                            </NuxtLink>
                        </li>
                    </ul>

                    <!-- DESKTOP RIGHT -->
                    <div class="hidden lg:flex items-center gap-3">
                        <NuxtLink to="/login"
                            class="bg-[#0f766e] hover:bg-[#115e59] text-white text-sm font-semibold px-5 py-2 rounded-full transition">
                            Login / Daftar
                        </NuxtLink>

                        <!-- <div class="w-9 h-9 rounded-full border flex items-center justify-center">
                            <img src="/images/Group 2.png" alt="ID" class="w-9 h-9" />
                        </div> -->
                    </div>

                    <!-- MOBILE TOGGLE -->
                    <button class="lg:hidden text-gray-700" @click="mobileOpen = !mobileOpen">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                </div>
        </div>

        <!-- MOBILE MENU -->
        <div v-if="mobileOpen" class="lg:hidden mt-4 bg-white rounded-2xl shadow-md p-6">
            <ul class="flex flex-col gap-4 text-center font-medium">
                <li>
                    <NuxtLink to="/" @click="mobileOpen = false">Kemitraan</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/katalog" @click="mobileOpen = false">Katalog Produk</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/artikel" @click="mobileOpen = false">Artikel</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/kontak" @click="mobileOpen = false">Kontak Kami</NuxtLink>
                </li>

                <li class="pt-3">
                    <NuxtLink to="/login" class="block bg-emerald-500 text-white py-2 rounded-full">
                        Login / Daftar
                    </NuxtLink>
                </li>
            </ul>
        </div>

        </div>
    </nav>
</template>
