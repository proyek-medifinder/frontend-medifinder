<template>
    <footer class="bg-[#0f766e] text-white">
        <div class="max-w-7xl mx-auto px-6 py-16">

            <!-- GRID -->
            <div class="grid md:grid-cols-4 gap-10">

                <!-- BRAND -->
                <div>
                    <div class="inline-flex bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
                        <img src="/images/Logo_remove.png" class="h-10" />
                    </div>

                    <p class="text-white/80 leading-relaxed text-sm">
                        MediFinder adalah platform pencarian apotek online yang membantu
                        pengguna menemukan obat, konsultasi, dan layanan kesehatan dengan
                        mudah dan cepat.
                    </p>
                </div>

                <!-- NAVIGATION -->
                <div>
                    <h3 class="font-semibold mb-4">Navigasi</h3>
                    <ul class="space-y-2 text-white/80 text-sm">
                        <li>
                            <NuxtLink to="/" class="hover:text-white">Homepage</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/tentang" class="hover:text-white">About Us</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/kontak" class="hover:text-white">Contact</NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- CONTACT -->
                <div>
                    <h3 class="font-semibold mb-4">Kontak</h3>
                    <ul class="space-y-2 text-white/80 text-sm">
                        <li>support@medifinder.id</li>
                        <li>+62 812-3456-7890</li>
                        <li>Indramayu, Jawa Barat</li>
                    </ul>
                </div>

                <!-- SOCIAL -->
                <div>
                    <h3 class="font-semibold mb-4">Follow Kami</h3>

                    <div class="flex gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
                            </svg>
                        </div>

                        <!-- <div
                            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
                            X
                        </div> -->

                        <div
                            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>

            <!-- DIVIDER -->
            <div class="border-t border-white/20 mt-12 pt-6 text-center text-sm text-white/70">
                © {{ new Date().getFullYear() }} MediFinder. All rights reserved.
            </div>

        </div>
    </footer>
</template>
