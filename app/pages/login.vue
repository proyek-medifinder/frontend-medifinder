
<template>
    <div class="min-h-screen grid lg:grid-cols-2">

        <!-- LEFT PANEL -->
        <div class="flex items-center bg-[#0f766e] text-white">
            <div class="max-w-md mx-auto px-12">

                <!-- <img src="/images/Logo_remove.png" class="h-32 mb-10" /> -->

                <h1 class="text-4xl font-bold mb-4">MediFinder</h1>

                <p class="text-white/90 leading-relaxed">
                    Platform pencarian apotek online yang membantu Anda menemukan obat,
                    konsultasi, dan layanan kesehatan dengan mudah.
                </p>

                <div class="mt-10 space-y-3 text-white/90">
                    <div>✓ Akses cepat ke apotek terdekat</div>
                    <div>✓ Konsultasi online</div>
                    <div>✓ Beli obat dari rumah</div>
                </div>

                <div class="mt-16 text-white/60 text-sm">
                    © 2026 MediFinder
                </div>

            </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="flex items-center justify-center bg-slate-50">

            <div class="w-full max-w-md px-8">

                <div class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900">
                        Sign In to Your Account
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        Masukkan detail Anda untuk masuk
                    </p>
                </div>

                <form class="space-y-4">
                    <input type="text" placeholder="Username"
                        class="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                    <input type="password" placeholder="Password"
                        class="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                    <div class="text-right text-sm text-gray-500">
                        Lupa password?
                    </div>

                    <button
                        class="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-3 rounded-lg transition">
                        Masuk
                    </button>
                </form>

                <button
                    class="mt-4 w-full border py-3 rounded-lg bg-white hover:bg-gray-100 transition flex items-center justify-center gap-3">
                    <!-- GOOGLE ICON -->
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303C33.62 32.657 29.215 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.061 0 5.842 1.154 7.961 3.039l5.657-5.657C34.073 6.053 29.297 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.655 16.108 19.007 13 24 13c3.061 0 5.842 1.154 7.961 3.039l5.657-5.657C34.073 6.053 29.297 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z" />
                        <path fill="#4CAF50"
                            d="M24 44c5.11 0 9.786-1.957 13.299-5.148l-6.144-5.199C29.112 35.091 26.676 36 24 36c-5.196 0-9.592-3.332-11.271-7.946l-6.522 5.025C9.454 39.556 16.227 44 24 44z" />
                        <path fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303c-.816 2.329-2.29 4.345-4.248 5.653l6.144 5.199C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>

                    Login dengan Google
                </button>


                <div class="text-center mt-6 text-sm text-gray-500">
                    Tidak punya akun?
                    <span class="text-[#0f766e] font-medium">
                        Ajukan sekarang
                    </span>
                </div>

                <NuxtLink to="/" class="block text-center mt-4 text-sm text-gray-500 hover:text-gray-700">
                    ← Kembali ke Beranda
                </NuxtLink>

            </div>
        </div>

    </div>
</template>

<script setup>
definePageMeta({
    layout: 'auth'
})

useHead({
    title: "Sign In"
})
</script>

